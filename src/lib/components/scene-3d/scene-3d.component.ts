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
  templateUrl: './scene-3d.component.html',
  styleUrls: ['./scene-3d.component.scss']
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
