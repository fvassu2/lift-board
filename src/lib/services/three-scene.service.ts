import { Injectable } from '@angular/core';
import * as THREE from 'three';
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
  private containerMeshes: THREE.Mesh[] = [];
  private animationFrameId: number | null = null;
  private currentView: CameraView = 'orbital';

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
   */
  createVehicle(vehicle: Vehicle): void {
    // Remove existing vehicle if any
    if (this.vehicleMesh) {
      this.scene.remove(this.vehicleMesh);
    }

    // Create vehicle group
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
   * Create a forklift vehicle using basic geometries
   */
  private createForklift(group: THREE.Group): void {
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff6600 }); // Orange

    // Main body
    const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 3);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 1.5, 0);
    group.add(body);

    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(1.8, 1, 1.5);
    const cabin = new THREE.Mesh(cabinGeometry, bodyMaterial);
    cabin.position.set(0, 2.5, -0.5);
    group.add(cabin);

    // Wheels
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
    
    const positions = [
      { x: -0.8, z: 1 },
      { x: 0.8, z: 1 },
      { x: -0.8, z: -1 },
      { x: 0.8, z: -1 }
    ];

    positions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos.x, 0.5, pos.z);
      group.add(wheel);
    });

    // Forks
    const forkMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const forkGeometry = new THREE.BoxGeometry(0.2, 0.1, 2);
    
    const fork1 = new THREE.Mesh(forkGeometry, forkMaterial);
    fork1.position.set(-0.5, 0.3, 2.5);
    group.add(fork1);

    const fork2 = new THREE.Mesh(forkGeometry, forkMaterial);
    fork2.position.set(0.5, 0.3, 2.5);
    group.add(fork2);

    // Mast
    const mastGeometry = new THREE.BoxGeometry(0.3, 3, 0.3);
    const mast = new THREE.Mesh(mastGeometry, forkMaterial);
    mast.position.set(0, 2, 1.5);
    group.add(mast);
  }

  /**
   * Create a pallet jack vehicle using basic geometries
   */
  private createPalletJack(group: THREE.Group): void {
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x2196f3 }); // Blue

    // Main body (low profile)
    const bodyGeometry = new THREE.BoxGeometry(1.5, 0.3, 2.5);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0.3, 0);
    group.add(body);

    // Handle
    const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(0, 1, -1.5);
    group.add(handle);

    // Small wheels
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 12);
    
    const positions = [
      { x: -0.5, z: 1 },
      { x: 0.5, z: 1 },
      { x: 0, z: -1 }
    ];

    positions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos.x, 0.15, pos.z);
      group.add(wheel);
    });

    // Forks
    const forkMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const forkGeometry = new THREE.BoxGeometry(0.15, 0.08, 2);
    
    const fork1 = new THREE.Mesh(forkGeometry, forkMaterial);
    fork1.position.set(-0.4, 0.15, 1.5);
    group.add(fork1);

    const fork2 = new THREE.Mesh(forkGeometry, forkMaterial);
    fork2.position.set(0.4, 0.15, 1.5);
    group.add(fork2);
  }

  /**
   * Create a stacker vehicle using basic geometries
   */
  private createStacker(group: THREE.Group): void {
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50 }); // Green

    // Main body
    const bodyGeometry = new THREE.BoxGeometry(1.8, 1, 2);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 1, 0);
    group.add(body);

    // Wheels
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.25, 16);
    
    const positions = [
      { x: -0.7, z: 0.8 },
      { x: 0.7, z: 0.8 },
      { x: -0.7, z: -0.8 },
      { x: 0.7, z: -0.8 }
    ];

    positions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos.x, 0.4, pos.z);
      group.add(wheel);
    });

    // Tall mast
    const mastMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const mastGeometry = new THREE.BoxGeometry(0.2, 4, 0.2);
    const mast = new THREE.Mesh(mastGeometry, mastMaterial);
    mast.position.set(0, 3, 0.9);
    group.add(mast);

    // Lifting platform
    const platformGeometry = new THREE.BoxGeometry(1.5, 0.1, 1);
    const platform = new THREE.Mesh(platformGeometry, mastMaterial);
    platform.position.set(0, 1.5, 1.2);
    group.add(platform);
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

    const containerMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffa500,
      roughness: 0.7,
      metalness: 0.3
    });

    for (let i = 0; i < count; i++) {
      const containerGeometry = new THREE.BoxGeometry(1.2, 1, 1.2);
      const container = new THREE.Mesh(containerGeometry, containerMaterial);
      
      // Stack containers on top of each other
      container.position.set(0, 0.5 + (i * 1), 1.5);
      
      this.scene.add(container);
      this.containerMeshes.push(container);
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
