import { Component, ElementRef, ViewChild, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeSceneService, CameraView } from '../../services/three-scene.service';
import { VehicleService } from '../../services';

/**
 * 3D scene component - renders Three.js scene with vehicles and containers
 */
@Component({
  selector: 'app-scene-3d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scene-container">
      <canvas #canvas></canvas>
      <div class="camera-controls">
        <button 
          *ngFor="let view of cameraViews"
          [class.active]="currentView === view"
          (click)="switchCamera(view)">
          {{ view | titlecase }}
        </button>
      </div>
      @if (!hasVehicle) {
        <div class="no-vehicle-message">
          <p>👆 Please select a vehicle to begin</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .scene-container {
      position: relative;
      width: 100%;
      height: 100%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }

    .camera-controls {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .camera-controls button {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      min-width: 80px;
      min-height: 44px;
    }

    .camera-controls button:hover {
      background: white;
      border-color: #2196f3;
    }

    .camera-controls button.active {
      background: #2196f3;
      color: white;
      border-color: #2196f3;
    }

    .no-vehicle-message {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .no-vehicle-message p {
      font-size: 1.2rem;
      color: #666;
      margin: 0;
    }
  `]
})
export class Scene3dComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private threeSceneService = inject(ThreeSceneService);
  private vehicleService = inject(VehicleService);

  cameraViews: CameraView[] = ['orbital', 'top-down', 'first-person', 'side'];
  currentView: CameraView = 'orbital';
  hasVehicle = false;

  constructor() {
    // React to vehicle selection changes
    effect(() => {
      const selectedVehicle = this.vehicleService.getSelectedVehicle()();
      if (selectedVehicle) {
        this.threeSceneService.createVehicle(selectedVehicle);
        this.hasVehicle = true;
      } else {
        this.hasVehicle = false;
      }
    });
  }

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.threeSceneService.initScene(canvas, width, height);

    // Handle window resize
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    this.threeSceneService.dispose();
  }

  switchCamera(view: CameraView): void {
    this.currentView = view;
    this.threeSceneService.setCameraView(view);
  }

  private onResize = (): void => {
    const canvas = this.canvasRef.nativeElement;
    this.threeSceneService.onResize(canvas.clientWidth, canvas.clientHeight);
  }
}
