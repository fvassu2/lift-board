import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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

  /**
   * Initialize the Three.js scene
   */
  initScene(canvas: HTMLCanvasElement, width: number, height: number): void {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.setCameraView('orbital');

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Add lighting
    this.addLights();

    // Add ground plane
    this.addGround();

    // Start animation loop
    this.animate();
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
    }

    // Try to load external GLTF model
    const modelPath = `assets/models/${vehicle.type}.glb`;
    
    this.gltfLoader.load(
      modelPath,
      // Success callback
      (gltf) => {
        console.log(`✅ Loaded external model for ${vehicle.type}`);
        const model = gltf.scene;
        
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
        
        this.scene.add(model);
        this.vehicleMesh = model;
      },
      // Progress callback
      undefined,
      // Error callback - fallback to procedural geometry
      (error) => {
        console.log(`ℹ️ External model not found for ${vehicle.type}, using procedural geometry`);
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
   * Add containers to the vehicle
   */
  addContainers(count: number): void {
    // Remove existing containers
    this.containerMeshes.forEach(mesh => this.scene.remove(mesh));
    this.containerMeshes = [];

    if (!this.vehicleMesh) {
      return;
    }

    for (let i = 0; i < count; i++) {
      // Create a realistic pallet container
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

      // Stack containers on top of each other
      containerGroup.position.set(0, 0.5 + (i * 1), 1.5);
      
      this.scene.add(containerGroup);
      this.containerMeshes.push(containerGroup);
    }
  }

  /**
   * Set the camera view
   */
  setCameraView(view: CameraView): void {
    this.currentView = view;

    switch (view) {
      case 'orbital':
        this.camera.position.set(8, 8, 8);
        this.camera.lookAt(0, 2, 0);
        break;
      case 'top-down':
        this.camera.position.set(0, 20, 0);
        this.camera.lookAt(0, 0, 0);
        break;
      case 'first-person':
        this.camera.position.set(0, 3, -5);
        this.camera.lookAt(0, 2, 0);
        break;
      case 'side':
        this.camera.position.set(12, 5, 0);
        this.camera.lookAt(0, 2, 0);
        break;
    }
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

    // Rotate vehicle slowly for visual effect (only in orbital view)
    if (this.vehicleMesh && this.currentView === 'orbital') {
      this.vehicleMesh.rotation.y += 0.005;
    }

    this.renderer.render(this.scene, this.camera);
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
