import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Vehicle } from '../models';

/**
 * Camera view types available in the 3D scene
 */
export type CameraView = 'orbital' | 'top-down' | 'first-person' | 'side';

/**
 * Service to manage Three.js scene, vehicles, and containers
 */
@Injectable({
  providedIn: 'root'
})
export class ThreeSceneService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private vehicleMesh: THREE.Group | null = null;
  private containerMeshes: THREE.Group[] = [];
  private animationFrameId: number | null = null;
  private currentView: CameraView = 'orbital';
  private gltfLoader: GLTFLoader = new GLTFLoader();
  private controls!: OrbitControls;
  private missionActive: boolean = false;
  private animationProgress: number = 0;
  private animationPath: THREE.Vector3[] = [];
  private canvas!: HTMLCanvasElement;
  private initialCameraPosition: THREE.Vector3 = new THREE.Vector3(8, 8, 8);
  private initialControlsTarget: THREE.Vector3 = new THREE.Vector3(0, 2, 0);
  private isTouchDevice: boolean = false;
  private animationLoop: boolean = false; // Flag for loop animation
  private baseRotation: THREE.Euler = new THREE.Euler(0, 0, 0); // Base rotation from config
  private baseTranslation: THREE.Vector3 = new THREE.Vector3(0, 0, 0); // Base translation from config

  /**
   * Initialize the Three.js scene
   */
  initScene(canvas: HTMLCanvasElement, width: number, height: number): void {
    this.canvas = canvas;

    // Detect if device supports touch
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.copy(this.initialCameraPosition);
    this.camera.lookAt(this.initialControlsTarget);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Add OrbitControls for pan, zoom, rotate
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true; // Smooth controls
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI / 2; // Prevent going below ground
    this.controls.target.copy(this.initialControlsTarget);

    // Configure controls based on device type
    this.configureControls();

    // Add lighting
    this.addLights();

    // Add ground plane
    this.addGround();

    // Start animation loop
    this.animate();
  }

  /**
   * Configure controls based on device type (desktop vs tablet)
   */
  private configureControls(): void {
    if (this.isTouchDevice) {
      // Tablet/Touch controls (Google Earth style)
      // One finger drag: rotate
      // Two finger drag: pan
      // Two finger pinch: zoom
      this.controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
    } else {
      // Desktop controls
      // Mouse drag: rotate (default)
      // Ctrl + Mouse drag: pan
      // Scroll: zoom
      this.controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };

      // Override to use Ctrl+Left for pan
      const domElement = this.controls.domElement;

      if (domElement) {
        let ctrlPressed = false;

        domElement.addEventListener('keydown', (e) => {
          if (e.ctrlKey || e.metaKey) {
            ctrlPressed = true;
            this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
          }
        });

        domElement.addEventListener('keyup', (e) => {
          if (!e.ctrlKey && !e.metaKey) {
            ctrlPressed = false;
            this.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
          }
        });

        domElement.addEventListener('mousedown', (e) => {
          if (e.ctrlKey || e.metaKey) {
            this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
          } else {
            this.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
          }
        });
      }
    }
  }

  /**
   * Add lighting to the scene
   */
  private addLights(): void {
    // Ambient light for general illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light for shadows and definition
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    this.scene.add(directionalLight);

    // Another directional light from opposite side
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-10, 10, -10);
    this.scene.add(directionalLight2);
  }

  /**
   * Add ground plane to the scene
   */
  private addGround(): void {
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    this.scene.add(ground);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(50, 50, 0x000000, 0x444444);
    this.scene.add(gridHelper);
  }

  /**
   * Create and add a vehicle to the scene
   * Attempts to load external GLTF model first, falls back to procedural geometry
   */
  createVehicle(vehicle: Vehicle): void {
    // Remove existing vehicle if any
    if (this.vehicleMesh) {
      this.scene.remove(this.vehicleMesh);
      // Also remove containers since they'll be re-attached
      this.containerMeshes.forEach(mesh => this.scene.remove(mesh));
      this.containerMeshes = [];
    }

    // Reset base transformations
    this.baseRotation.set(0, 0, 0);
    this.baseTranslation.set(0, 0, 0);

    // Get model configuration from vehicle
    const modelConfig = vehicle.modelConfig;
    const modelFilename = modelConfig?.filename || `${vehicle.type}.glb`;

    // Store base transformations for use during animation
    if (modelConfig) {
      this.baseRotation.set(
        modelConfig.rotation.x * (Math.PI / 180),
        modelConfig.rotation.y * (Math.PI / 180),
        modelConfig.rotation.z * (Math.PI / 180)
      );
      this.baseTranslation.set(
        modelConfig.translation.x,
        modelConfig.translation.y,
        modelConfig.translation.z
      );
      console.log(`📋 Model config loaded:`, {
        filename: modelFilename,
        rotation: `X=${modelConfig.rotation.x}° Y=${modelConfig.rotation.y}° Z=${modelConfig.rotation.z}°`,
        translation: `X=${modelConfig.translation.x} Y=${modelConfig.translation.y} Z=${modelConfig.translation.z}`
      });
    }

    // Try to load external GLTF model
    const modelPath = `assets/models/${modelFilename}`;

    this.gltfLoader.load(
      modelPath,
      // Success callback
      (gltf) => {
        console.log(`✅ Loaded external model: ${modelFilename}`);
        const model = gltf.scene;

        // Traverse and ensure materials are properly set
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Enable shadows
            child.castShadow = true;
            child.receiveShadow = true;

            // Ensure textures are properly configured
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  mat.needsUpdate = true;
                  if (mat.map) mat.map.needsUpdate = true;
                });
              } else {
                child.material.needsUpdate = true;
                if (child.material.map) child.material.map.needsUpdate = true;
              }
            }
          }
        });

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Normalize scale to approximately 3 units height
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        model.scale.setScalar(scale);

        // Center the model
        model.position.sub(center.multiplyScalar(scale));
        model.position.y = 0; // Place on ground

        // Apply base rotation from configuration
        model.rotation.copy(this.baseRotation);

        // Apply base translation from configuration
        model.position.add(this.baseTranslation);

        this.scene.add(model);
        this.vehicleMesh = model;
      },
      // Progress callback
      (xhr) => {
        console.log(`Loading ${modelFilename}: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
      },
      // Error callback - fallback to procedural geometry
      (error) => {
        console.log(`ℹ️ External model not found (${modelFilename}), using procedural geometry`);
        console.error('Error details:', error);
        this.createProceduralVehicle(vehicle);
      }
    );
  }

  /**
   * Create vehicle using procedural geometry (fallback)
   */
  private createProceduralVehicle(vehicle: Vehicle): void {
    const vehicleGroup = new THREE.Group();

    switch (vehicle.type) {
      case 'forklift':
        this.createForklift(vehicleGroup);
        break;
      case 'pallet-jack':
        this.createPalletJack(vehicleGroup);
        break;
      case 'stacker':
        this.createStacker(vehicleGroup);
        break;
    }

    vehicleGroup.position.set(0, 0, 0);
    this.scene.add(vehicleGroup);
    this.vehicleMesh = vehicleGroup;
  }

  /**
   * Create a realistic forklift vehicle with detailed geometry
   */
  private createForklift(group: THREE.Group): void {
    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      metalness: 0.4,
      roughness: 0.6
    });
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.8,
      roughness: 0.3
    });
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.9
    });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.4,
      metalness: 0.1,
      roughness: 0.1
    });

    // Chassis - lower body with rounded edges
    const chassisGeometry = new THREE.BoxGeometry(2.2, 0.8, 3.5);
    const chassis = new THREE.Mesh(chassisGeometry, bodyMaterial);
    chassis.position.set(0, 0.8, 0);
    group.add(chassis);

    // Engine compartment
    const engineGeometry = new THREE.BoxGeometry(1.8, 0.6, 1.2);
    const engine = new THREE.Mesh(engineGeometry, bodyMaterial);
    engine.position.set(0, 1.5, -1.5);
    group.add(engine);

    // Operator cabin with safety cage
    const cabinBaseGeometry = new THREE.BoxGeometry(1.6, 0.3, 1.4);
    const cabinBase = new THREE.Mesh(cabinBaseGeometry, bodyMaterial);
    cabinBase.position.set(0, 1.9, -0.3);
    group.add(cabinBase);

    // Cabin roof
    const roofGeometry = new THREE.BoxGeometry(1.7, 0.15, 1.5);
    const roof = new THREE.Mesh(roofGeometry, bodyMaterial);
    roof.position.set(0, 2.8, -0.3);
    group.add(roof);

    // Windshield
    const windshieldGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.05);
    const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
    windshield.position.set(0, 2.3, 0.4);
    group.add(windshield);

    // Cabin pillars (safety cage)
    const pillarGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8);
    const pillarPositions = [
      { x: -0.75, z: -1 },
      { x: 0.75, z: -1 },
      { x: -0.75, z: 0.4 },
      { x: 0.75, z: 0.4 }
    ];
    pillarPositions.forEach(pos => {
      const pillar = new THREE.Mesh(pillarGeometry, metalMaterial);
      pillar.position.set(pos.x, 2.35, pos.z);
      group.add(pillar);
    });

    // Wheels - larger and more detailed
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 20);
    const rimGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.36, 16);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      metalness: 0.7,
      roughness: 0.3
    });

    const wheelPositions = [
      { x: -1.0, z: 1.3 },
      { x: 1.0, z: 1.3 },
      { x: -1.0, z: -1.3 },
      { x: 1.0, z: -1.3 }
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos.x, 0.5, pos.z);
      group.add(wheel);

      // Add wheel rims
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(pos.x > 0 ? pos.x + 0.01 : pos.x - 0.01, 0.5, pos.z);
      group.add(rim);
    });

    // Mast - dual rail system
    const mastWidth = 0.15;
    const mastHeight = 3.5;
    const mastGeometry = new THREE.BoxGeometry(mastWidth, mastHeight, 0.15);

    const mast1 = new THREE.Mesh(mastGeometry, metalMaterial);
    mast1.position.set(-0.4, 2.3, 1.6);
    group.add(mast1);

    const mast2 = new THREE.Mesh(mastGeometry, metalMaterial);
    mast2.position.set(0.4, 2.3, 1.6);
    group.add(mast2);

    // Mast cross bracing
    const braceGeometry = new THREE.BoxGeometry(0.9, 0.08, 0.08);
    [1.5, 2.5, 3.5].forEach(height => {
      const brace = new THREE.Mesh(braceGeometry, metalMaterial);
      brace.position.set(0, height, 1.6);
      group.add(brace);
    });

    // Carriage plate
    const carriageGeometry = new THREE.BoxGeometry(1.0, 0.2, 0.3);
    const carriage = new THREE.Mesh(carriageGeometry, metalMaterial);
    carriage.position.set(0, 1.2, 1.7);
    group.add(carriage);

    // Forks - realistic proportions
    const forkGeometry = new THREE.BoxGeometry(0.12, 0.08, 1.8);

    const fork1 = new THREE.Mesh(forkGeometry, metalMaterial);
    fork1.position.set(-0.35, 0.5, 2.6);
    group.add(fork1);

    const fork2 = new THREE.Mesh(forkGeometry, metalMaterial);
    fork2.position.set(0.35, 0.5, 2.6);
    group.add(fork2);

    // Fork backs (vertical part)
    const forkBackGeometry = new THREE.BoxGeometry(0.12, 0.7, 0.08);
    const forkBack1 = new THREE.Mesh(forkBackGeometry, metalMaterial);
    forkBack1.position.set(-0.35, 0.85, 1.65);
    group.add(forkBack1);

    const forkBack2 = new THREE.Mesh(forkBackGeometry, metalMaterial);
    forkBack2.position.set(0.35, 0.85, 1.65);
    group.add(forkBack2);

    // Hydraulic cylinders
    const cylinderGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 12);
    const cylinderMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.6,
      roughness: 0.4
    });

    [-0.5, 0.5].forEach(x => {
      const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
      cylinder.position.set(x, 2, 1.5);
      group.add(cylinder);
    });

    // Counterweight at rear
    const counterweightGeometry = new THREE.BoxGeometry(2.0, 0.6, 0.8);
    const counterweight = new THREE.Mesh(counterweightGeometry, new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.7,
      roughness: 0.5
    }));
    counterweight.position.set(0, 0.6, -2.0);
    group.add(counterweight);

    // Headlights
    const lightGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12);
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffaa,
      emissive: 0xffffaa,
      emissiveIntensity: 0.5
    });

    [-0.6, 0.6].forEach(x => {
      const light = new THREE.Mesh(lightGeometry, lightMaterial);
      light.rotation.x = Math.PI / 2;
      light.position.set(x, 1.5, 1.8);
      group.add(light);
    });

    // Steering wheel
    const steeringRingGeometry = new THREE.TorusGeometry(0.25, 0.03, 16, 32);
    const steeringRing = new THREE.Mesh(steeringRingGeometry, metalMaterial);
    steeringRing.rotation.x = Math.PI / 4;
    steeringRing.position.set(0.3, 2.1, 0.2);
    group.add(steeringRing);

    // Add seat
    const seatBaseGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
    const seatBase = new THREE.Mesh(seatBaseGeometry, new THREE.MeshStandardMaterial({ color: 0x111111 }));
    seatBase.position.set(-0.2, 2.0, -0.3);
    group.add(seatBase);

    const seatBackGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
    const seatBack = new THREE.Mesh(seatBackGeometry, new THREE.MeshStandardMaterial({ color: 0x111111 }));
    seatBack.position.set(-0.2, 2.3, -0.5);
    group.add(seatBack);
  }

  /**
   * Create a realistic pallet jack with detailed geometry
   */
  private createPalletJack(group: THREE.Group): void {
    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x2196f3,
      metalness: 0.5,
      roughness: 0.5
    });
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      metalness: 0.8,
      roughness: 0.3
    });
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.9
    });
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.6,
      roughness: 0.4
    });

    // Main body (low profile base)
    const bodyGeometry = new THREE.BoxGeometry(1.6, 0.25, 2.8);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0.25, 0);
    group.add(body);

    // Hydraulic pump housing
    const pumpGeometry = new THREE.BoxGeometry(0.4, 0.45, 0.6);
    const pump = new THREE.Mesh(pumpGeometry, bodyMaterial);
    pump.position.set(0, 0.45, -1.2);
    group.add(pump);

    // Handle post (vertical)
    const handlePostGeometry = new THREE.CylinderGeometry(0.06, 0.08, 1.3, 12);
    const handlePost = new THREE.Mesh(handlePostGeometry, handleMaterial);
    handlePost.position.set(0, 0.95, -1.5);
    group.add(handlePost);

    // Handle grip (horizontal)
    const handleGripGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 12);
    const handleGrip = new THREE.Mesh(handleGripGeometry, handleMaterial);
    handleGrip.rotation.z = Math.PI / 2;
    handleGrip.position.set(0, 1.6, -1.5);
    group.add(handleGrip);

    // Control lever
    const leverGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
    const lever = new THREE.Mesh(leverGeometry, new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    lever.rotation.x = Math.PI / 4;
    lever.position.set(0.3, 1.5, -1.4);
    group.add(lever);

    // Fork arms (longer and more detailed)
    const forkGeometry = new THREE.BoxGeometry(0.12, 0.06, 2.2);

    const fork1 = new THREE.Mesh(forkGeometry, metalMaterial);
    fork1.position.set(-0.5, 0.12, 1.3);
    group.add(fork1);

    const fork2 = new THREE.Mesh(forkGeometry, metalMaterial);
    fork2.position.set(0.5, 0.12, 1.3);
    group.add(fork2);

    // Fork rollers (wheels under forks)
    const rollerGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 12);
    const rollerMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      metalness: 0.6
    });

    const rollerPositions = [
      { x: -0.5, z: 0.5 },
      { x: 0.5, z: 0.5 },
      { x: -0.5, z: 2.0 },
      { x: 0.5, z: 2.0 }
    ];

    rollerPositions.forEach(pos => {
      const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
      roller.rotation.z = Math.PI / 2;
      roller.position.set(pos.x, 0.08, pos.z);
      group.add(roller);
    });

    // Main wheels (larger and detailed)
    const wheelGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.18, 20);

    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.rotation.z = Math.PI / 2;
    wheel1.position.set(-0.6, 0.22, 0.3);
    group.add(wheel1);

    const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel2.rotation.z = Math.PI / 2;
    wheel2.position.set(0.6, 0.22, 0.3);
    group.add(wheel2);

    // Steering wheel (single, centered at back)
    const steeringWheelGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16);
    const steeringWheel = new THREE.Mesh(steeringWheelGeometry, wheelMaterial);
    steeringWheel.rotation.z = Math.PI / 2;
    steeringWheel.position.set(0, 0.18, -1.2);
    group.add(steeringWheel);

    // Hydraulic cylinder (visible under pump)
    const cylinderGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 12);
    const cylinder = new THREE.Mesh(cylinderGeometry, new THREE.MeshStandardMaterial({
      color: 0x666666,
      metalness: 0.7
    }));
    cylinder.rotation.x = Math.PI / 2;
    cylinder.position.set(0, 0.3, -0.9);
    group.add(cylinder);

    // Fork support brackets
    const bracketGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.1);
    [-0.5, 0.5].forEach(x => {
      const bracket = new THREE.Mesh(bracketGeometry, bodyMaterial);
      bracket.position.set(x, 0.25, 0.2);
      group.add(bracket);
    });

    // Safety decals/stripes
    const stripeGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.15);
    const stripeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.2
    });
    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
    stripe.position.set(0, 0.4, -1.2);
    group.add(stripe);
  }

  /**
   * Create a realistic stacker with detailed geometry
   */
  private createStacker(group: THREE.Group): void {
    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x4caf50,
      metalness: 0.4,
      roughness: 0.6
    });
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xbbbbbb,
      metalness: 0.8,
      roughness: 0.2
    });
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.9
    });

    // Base platform
    const baseGeometry = new THREE.BoxGeometry(1.9, 0.4, 2.2);
    const base = new THREE.Mesh(baseGeometry, bodyMaterial);
    base.position.set(0, 0.5, 0);
    group.add(base);

    // Battery compartment
    const batteryGeometry = new THREE.BoxGeometry(1.5, 0.5, 1.2);
    const battery = new THREE.Mesh(batteryGeometry, new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.3
    }));
    battery.position.set(0, 0.85, -0.5);
    group.add(battery);

    // Control panel housing
    const controlGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.3);
    const control = new THREE.Mesh(controlGeometry, bodyMaterial);
    control.position.set(0, 1.4, 0.95);
    group.add(control);

    // Control buttons (colorful details)
    const buttonGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 12);
    const buttonColors = [0xff0000, 0x00ff00, 0xffff00];
    buttonColors.forEach((color, i) => {
      const button = new THREE.Mesh(buttonGeometry, new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3
      }));
      button.rotation.x = Math.PI / 2;
      button.position.set((i - 1) * 0.12, 1.6, 1.1);
      group.add(button);
    });

    // Handle bars (T-shaped)
    const handleBarGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 12);
    const handleBar = new THREE.Mesh(handleBarGeometry, new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.6
    }));
    handleBar.rotation.z = Math.PI / 2;
    handleBar.position.set(0, 1.8, 1.0);
    group.add(handleBar);

    const handleGripGeometry = new THREE.BoxGeometry(0.12, 0.12, 0.15);
    [-0.35, 0.35].forEach(x => {
      const grip = new THREE.Mesh(handleGripGeometry, new THREE.MeshStandardMaterial({ color: 0x222222 }));
      grip.position.set(x, 1.8, 1.0);
      group.add(grip);
    });

    // Wheels (larger and more realistic)
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 20);
    const rimGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.31, 16);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      metalness: 0.7
    });

    const wheelPositions = [
      { x: -0.8, z: 0.9 },
      { x: 0.8, z: 0.9 },
      { x: -0.8, z: -0.9 },
      { x: 0.8, z: -0.9 }
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos.x, 0.4, pos.z);
      group.add(wheel);

      // Wheel rims
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(pos.x, 0.4, pos.z);
      group.add(rim);
    });

    // Mast structure (triple telescopic)
    const mastWidth = 0.12;

    // Outer mast
    const outerMastGeometry = new THREE.BoxGeometry(mastWidth, 4.5, mastWidth);
    const outerMast1 = new THREE.Mesh(outerMastGeometry, metalMaterial);
    outerMast1.position.set(-0.5, 2.8, 0.95);
    group.add(outerMast1);

    const outerMast2 = new THREE.Mesh(outerMastGeometry, metalMaterial);
    outerMast2.position.set(0.5, 2.8, 0.95);
    group.add(outerMast2);

    // Middle mast (slightly inside)
    const middleMastGeometry = new THREE.BoxGeometry(mastWidth * 0.8, 4.0, mastWidth * 0.8);
    const middleMast1 = new THREE.Mesh(middleMastGeometry, new THREE.MeshStandardMaterial({
      color: 0x999999,
      metalness: 0.7
    }));
    middleMast1.position.set(-0.48, 2.8, 0.93);
    group.add(middleMast1);

    const middleMast2 = new THREE.Mesh(middleMastGeometry, new THREE.MeshStandardMaterial({
      color: 0x999999,
      metalness: 0.7
    }));
    middleMast2.position.set(0.48, 2.8, 0.93);
    group.add(middleMast2);

    // Mast cross braces
    const braceGeometry = new THREE.BoxGeometry(1.1, 0.06, 0.06);
    [1.5, 2.5, 3.5, 4.5].forEach(height => {
      const brace = new THREE.Mesh(braceGeometry, metalMaterial);
      brace.position.set(0, height, 0.95);
      group.add(brace);
    });

    // Hydraulic lift cylinders
    const cylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 3.8, 12);
    const cylinderMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      metalness: 0.7,
      roughness: 0.3
    });

    [-0.45, 0.45].forEach(x => {
      const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
      cylinder.position.set(x, 2.5, 0.85);
      group.add(cylinder);

      // Cylinder pistons (chromed)
      const pistonGeometry = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 12);
      const piston = new THREE.Mesh(pistonGeometry, new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        metalness: 0.9,
        roughness: 0.1
      }));
      piston.position.set(x, 3.5, 0.85);
      group.add(piston);
    });

    // Lifting carriage
    const carriageGeometry = new THREE.BoxGeometry(1.2, 0.25, 0.4);
    const carriage = new THREE.Mesh(carriageGeometry, bodyMaterial);
    carriage.position.set(0, 1.8, 1.0);
    group.add(carriage);

    // Fork support frame
    const forkFrameGeometry = new THREE.BoxGeometry(1.3, 0.15, 0.2);
    const forkFrame = new THREE.Mesh(forkFrameGeometry, metalMaterial);
    forkFrame.position.set(0, 1.0, 1.15);
    group.add(forkFrame);

    // Forks (adjustable width)
    const forkGeometry = new THREE.BoxGeometry(0.12, 0.08, 1.0);

    const fork1 = new THREE.Mesh(forkGeometry, metalMaterial);
    fork1.position.set(-0.45, 0.65, 1.6);
    group.add(fork1);

    const fork2 = new THREE.Mesh(forkGeometry, metalMaterial);
    fork2.position.set(0.45, 0.65, 1.6);
    group.add(fork2);

    // Fork backs (vertical supports)
    const forkBackGeometry = new THREE.BoxGeometry(0.12, 0.35, 0.08);
    const forkBack1 = new THREE.Mesh(forkBackGeometry, metalMaterial);
    forkBack1.position.set(-0.45, 0.85, 1.1);
    group.add(forkBack1);

    const forkBack2 = new THREE.Mesh(forkBackGeometry, metalMaterial);
    forkBack2.position.set(0.45, 0.85, 1.1);
    group.add(forkBack2);

    // Chain guides
    const chainGuideGeometry = new THREE.BoxGeometry(0.08, 4.0, 0.08);
    [-0.52, 0.52].forEach(x => {
      const guide = new THREE.Mesh(chainGuideGeometry, new THREE.MeshStandardMaterial({
        color: 0x666666,
        metalness: 0.5
      }));
      guide.position.set(x, 2.6, 0.88);
      group.add(guide);
    });

    // Safety backrest (load guard)
    const backrestGeometry = new THREE.BoxGeometry(1.1, 1.2, 0.05);
    const backrest = new THREE.Mesh(backrestGeometry, new THREE.MeshStandardMaterial({
      color: 0x666666,
      metalness: 0.6,
      transparent: true,
      opacity: 0.7
    }));
    backrest.position.set(0, 1.6, 1.05);
    group.add(backrest);

    // Warning light on top
    const lightGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 12);
    const light = new THREE.Mesh(lightGeometry, new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff6600,
      emissiveIntensity: 0.5
    }));
    light.position.set(0, 5.2, 0.95);
    group.add(light);
  }

  /**
   * Add containers to the vehicle (attached, not stationary)
   */
  addContainers(count: number): void {
    // Remove existing containers
    this.containerMeshes.forEach(mesh => {
      if (mesh.parent) {
        mesh.parent.remove(mesh);
      }
    });
    this.containerMeshes = [];

    if (!this.vehicleMesh) {
      return;
    }

    // Try to load external container model first
    const containerModelPath = 'assets/models/container.glb';

    // Load containers with a counter to track completion
    let loadedCount = 0;
    const attemptLoad = (index: number) => {
      this.gltfLoader.load(
        containerModelPath,
        // Success - use external model
        (gltf) => {
          const containerModel = gltf.scene.clone();

          // Scale and position the container
          const box = new THREE.Box3().setFromObject(containerModel);
          const size = box.getSize(new THREE.Vector3());
          const scale = 1.2 / Math.max(size.x, size.y, size.z);
          containerModel.scale.setScalar(scale);

          // Position on vehicle (stacked)
          containerModel.position.set(0, 0.5 + (index * 1), 1.5);

          // Attach to vehicle
          this.vehicleMesh!.add(containerModel);
          this.containerMeshes.push(containerModel);
        },
        undefined,
        // Error - use procedural geometry
        () => {
          if (loadedCount === 0) {
            console.log('ℹ️ Container model not found, using procedural geometry');
          }
          loadedCount++;

          const containerGroup = this.createProceduralContainer();
          containerGroup.position.set(0, 0.5 + (index * 1), 1.5);

          // Attach to vehicle
          this.vehicleMesh!.add(containerGroup);
          this.containerMeshes.push(containerGroup);
        }
      );
    };

    // Load all containers
    for (let i = 0; i < count; i++) {
      attemptLoad(i);
    }
  }

  /**
   * Create a procedural container/bin
   */
  private createProceduralContainer(): THREE.Group {
    const containerGroup = new THREE.Group();

    // Main container body with wood texture-like color
    const containerMaterial = new THREE.MeshStandardMaterial({
      color: 0xcd853f,
      roughness: 0.8,
      metalness: 0.1
    });

    const containerGeometry = new THREE.BoxGeometry(1.1, 0.9, 1.1);
    const container = new THREE.Mesh(containerGeometry, containerMaterial);
    container.position.set(0, 0.45, 0);
    containerGroup.add(container);

    // Pallet base (darker wood)
    const palletMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.9,
      metalness: 0
    });
    const palletGeometry = new THREE.BoxGeometry(1.2, 0.15, 1.2);
    const pallet = new THREE.Mesh(palletGeometry, palletMaterial);
    pallet.position.set(0, 0.075, 0);
    containerGroup.add(pallet);

    // Pallet slats (wooden planks detail)
    const slatGeometry = new THREE.BoxGeometry(1.2, 0.04, 0.12);
    for (let j = 0; j < 5; j++) {
      const slat = new THREE.Mesh(slatGeometry, palletMaterial);
      slat.position.set(0, 0.16, -0.5 + j * 0.25);
      containerGroup.add(slat);
    }

    // Metal strapping (corner reinforcements)
    const strapMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.4,
      metalness: 0.8
    });
    const strapGeometry = new THREE.BoxGeometry(0.05, 0.95, 0.05);
    const corners = [
      { x: -0.55, z: -0.55 },
      { x: 0.55, z: -0.55 },
      { x: -0.55, z: 0.55 },
      { x: 0.55, z: 0.55 }
    ];
    corners.forEach(corner => {
      const strap = new THREE.Mesh(strapGeometry, strapMaterial);
      strap.position.set(corner.x, 0.475, corner.z);
      containerGroup.add(strap);
    });

    // Warning labels
    const labelGeometry = new THREE.PlaneGeometry(0.3, 0.3);
    const labelMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.2
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(0, 0.6, 0.56);
    containerGroup.add(label);

    return containerGroup;
  }

  /**
   * Set the camera view
   */
  setCameraView(view: CameraView): void {
    this.currentView = view;

    // If not in mission, set static camera positions
    if (!this.missionActive) {
      this.updateCameraForView();
    }
    // If in mission, camera positioning is handled in animate loop
  }

  /**
   * Update camera position for current view (when not following vehicle)
   */
  private updateCameraForView(): void {
    switch (this.currentView) {
      case 'orbital':
        this.camera.position.copy(this.initialCameraPosition);
        this.controls.target.copy(this.initialControlsTarget);
        this.controls.enabled = true;
        break;
      case 'top-down':
        this.camera.position.set(0, 20, 0);
        this.controls.target.set(0, 0, 0);
        this.controls.enabled = true;
        break;
      case 'first-person':
        // Will be positioned relative to vehicle in animate loop
        if (this.vehicleMesh) {
          this.updateFirstPersonCamera();
        } else {
          this.camera.position.set(0, 2, 3);
          this.controls.target.set(0, 2, 0);
        }
        this.controls.enabled = false; // Disable controls in first-person during mission
        break;
      case 'side':
        this.camera.position.set(12, 5, 0);
        this.controls.target.set(0, 2, 0);
        this.controls.enabled = true;
        break;
    }

    this.controls.update();
  }

  /**
   * Update first-person camera to be inside vehicle looking forward
   */
  private updateFirstPersonCamera(): void {
    if (!this.vehicleMesh) return;

    // Position camera inside the vehicle (slightly elevated, centered)
    const cameraOffset = new THREE.Vector3(0, 2, -1.5); // Inside cabin, looking forward
    const worldCameraPos = this.vehicleMesh.localToWorld(cameraOffset.clone());
    this.camera.position.copy(worldCameraPos);

    // Calculate forward direction based on vehicle rotation
    const forward = new THREE.Vector3(0, 2, 3); // Look 3 units ahead
    const worldForward = this.vehicleMesh.localToWorld(forward.clone());
    this.camera.lookAt(worldForward);
  }

  /**
   * Get the current camera view
   */
  getCurrentView(): CameraView {
    return this.currentView;
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Always update controls (allow control during animation)
    this.controls.update();

    // Mission animation - move vehicle along path
    if (this.missionActive && this.vehicleMesh && this.animationPath.length > 1) {
      this.animationProgress += 0.002; // Animation speed

      if (this.animationProgress >= 1) {
        if (this.animationLoop) {
          // Loop back to start
          this.animationProgress = 0;
        } else {
          this.animationProgress = 1;
          this.missionActive = false; // Stop at end
        }
      }

      // Use smooth curve interpolation instead of linear
      const position = this.getPositionOnPath(this.animationProgress);
      const nextPosition = this.getPositionOnPath(Math.min(this.animationProgress + 0.01, 1));

      // Set vehicle position (add base translation to path position)
      this.vehicleMesh.position.copy(position).add(this.baseTranslation);

      // Rotate vehicle to face direction of travel
      const direction = new THREE.Vector3().subVectors(nextPosition, position).normalize();
      if (direction.length() > 0.01) {
        const angle = Math.atan2(direction.x, direction.z);
        // Combine animation rotation with base rotation from configuration
        this.vehicleMesh.rotation.set(
          this.baseRotation.x,
          this.baseRotation.y + angle,  // Add animation angle to base rotation
          this.baseRotation.z
        );
      }

      // Camera follows vehicle based on current view
      this.updateCameraFollowVehicle();
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Get position on path using smooth curve interpolation
   */
  private getPositionOnPath(t: number): THREE.Vector3 {
    if (this.animationPath.length < 2) {
      return new THREE.Vector3();
    }

    // Use Catmull-Rom spline for smooth curves
    const curve = new THREE.CatmullRomCurve3(this.animationPath);
    curve.curveType = 'catmullrom';
    curve.tension = 0.5; // Controls curve tightness

    return curve.getPoint(t);
  }

  /**
   * Update camera to follow vehicle during mission
   * Camera movement is relative to vehicle position and rotation
   */
  private updateCameraFollowVehicle(): void {
    if (!this.vehicleMesh) return;

    const vehiclePos = this.vehicleMesh.position;
    const vehicleRot = this.vehicleMesh.rotation.y;

    switch (this.currentView) {
      case 'orbital':
        // Follow from behind and above (relative to vehicle orientation)
        const offsetOrbital = new THREE.Vector3(0, 8, 8); // Behind and above in vehicle space
        const rotatedOffsetOrbital = offsetOrbital.clone().applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          vehicleRot
        );
        this.camera.position.copy(vehiclePos).add(rotatedOffsetOrbital);
        this.controls.target.copy(vehiclePos).add(new THREE.Vector3(0, 2, 0));
        break;

      case 'first-person':
        // Inside vehicle looking forward (always relative to vehicle)
        this.updateFirstPersonCamera();
        break;

      case 'top-down':
        // Above vehicle (follows position, not rotation)
        this.camera.position.set(vehiclePos.x, 20, vehiclePos.z);
        this.controls.target.copy(vehiclePos);
        break;

      case 'side':
        // Follow from side (relative to vehicle orientation)
        const offsetSide = new THREE.Vector3(12, 5, 0); // Right side in vehicle space
        const rotatedOffsetSide = offsetSide.clone().applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          vehicleRot
        );
        this.camera.position.copy(vehiclePos).add(rotatedOffsetSide);
        this.controls.target.copy(vehiclePos).add(new THREE.Vector3(0, 2, 0));
        break;
    }
  }

  /**
   * Start mission animation
   * @param targetLocation Target location for mission (e.g., "A-5-3")
   * @param loop Whether to loop the animation continuously
   */
  startMissionAnimation(targetLocation: string, loop: boolean = false): void {
    // Generate a path based on target location
    this.animationPath = this.generatePathForLocation(targetLocation);
    this.animationProgress = 0;
    this.missionActive = true;
    this.animationLoop = loop;
  }

  /**
   * Stop mission animation and reset camera
   */
  stopMissionAnimation(): void {
    this.missionActive = false;
    this.animationProgress = 0;
    this.animationLoop = false; // Clear loop flag

    // Reset camera to initial position
    this.resetCamera();
  }

  /**
   * Reset camera to initial/center position
   */
  resetCamera(): void {
    // Reset vehicle position to origin (with base translation applied)
    if (this.vehicleMesh) {
      this.vehicleMesh.position.copy(this.baseTranslation);
      this.vehicleMesh.rotation.copy(this.baseRotation);
    }

    // Reset camera to initial orbital view
    this.camera.position.copy(this.initialCameraPosition);
    this.controls.target.copy(this.initialControlsTarget);
    this.controls.enabled = true;
    this.controls.update();

    // Reset to orbital view
    this.currentView = 'orbital';
  }

  /**
   * Generate a path with curves based on target location
   */
  private generatePathForLocation(location: string): THREE.Vector3[] {
    // Parse location (e.g., "A-5-3")
    const parts = location.split('-');
    const aisle = parts[0] || 'A';
    const rack = parseInt(parts[1] || '5');
    const level = parseInt(parts[2] || '3');

    // Generate a path with more waypoints for smooth curves
    // Start position
    const start = new THREE.Vector3(0, 0, 0);

    // Create intermediate waypoints for curved path
    const waypoint1 = new THREE.Vector3(rack * 1, 0, 0);
    const waypoint2 = new THREE.Vector3(rack * 1.5, 0, rack * 0.5);
    const waypoint3 = new THREE.Vector3(rack * 2, 0, rack * 1.5);
    const waypoint4 = new THREE.Vector3(rack * 2, 0, rack * 2);

    // End position (simulated warehouse location)
    const end = new THREE.Vector3(
      rack * 2,
      0,
      rack * 2 + (aisle.charCodeAt(0) - 65) * 3
    );

    // Return path with multiple points for smooth curves
    return [start, waypoint1, waypoint2, waypoint3, waypoint4, end];
  }

  /**
   * Handle window resize
   */
  onResize(width: number, height: number): void {
    if (this.camera && this.renderer) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Dispose geometries and materials
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (object.material instanceof THREE.Material) {
          object.material.dispose();
        }
      }
    });

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
