import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mission } from '../../models';
import { RfidMockService } from '../../services';
import { ThreeSceneService } from '../../services/three-scene.service';

/**
 * Mission panel component - displays and manages mission information
 */
@Component({
  selector: 'app-mission-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mission-panel">
      <h2>Mission Control</h2>
      
      @if (!currentMission()) {
        <div class="mission-form">
          <div class="form-group">
            <label for="location">Target Location:</label>
            <input 
              type="text" 
              id="location"
              [(ngModel)]="targetLocation"
              placeholder="e.g., A-5-3">
          </div>
          
          <div class="form-group">
            <label for="containers">Container Count:</label>
            <input 
              type="number" 
              id="containers"
              [(ngModel)]="containerCount"
              min="1"
              max="10"
              placeholder="1-10">
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="loopAnimation">
              <span>Loop Animation</span>
            </label>
          </div>
          
          <button 
            class="btn btn-primary"
            (click)="startMission()"
            [disabled]="!targetLocation || containerCount < 1">
            Start Mission
          </button>
        </div>
      } @else {
        <div class="mission-info">
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value status-badge" [class]="'status-' + currentMission()!.status">
              {{ currentMission()!.status | uppercase }}
            </span>
          </div>
          
          <div class="info-row">
            <span class="label">Target Location:</span>
            <span class="value">{{ currentMission()!.targetLocation }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Containers:</span>
            <span class="value">{{ currentMission()!.containerCount }}</span>
          </div>
          
          <div class="container-ids">
            <p class="label">Expected Container IDs:</p>
            <div class="id-list">
              @for (id of currentMission()!.containerIds; track id) {
                <span class="container-id">{{ id }}</span>
              }
            </div>
          </div>
          
          <div class="button-group">
            <button 
              class="btn btn-success"
              (click)="completeMission()">
              Complete
            </button>
            <button 
              class="btn btn-danger"
              (click)="cancelMission()">
              Cancel
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .mission-panel {
      padding: 1rem;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .mission-form,
    .mission-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 600;
      color: #555;
      font-size: 0.95rem;
    }

    input {
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
      min-height: 44px;
    }

    input:focus {
      outline: none;
      border-color: #2196f3;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      color: #555;
      font-size: 0.95rem;
    }
    
    .checkbox-label input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
      min-height: auto;
    }
    
    .checkbox-label span {
      user-select: none;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 44px;
      min-width: 44px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #2196f3;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1976d2;
    }

    .btn-success {
      background: #4caf50;
      color: white;
    }

    .btn-success:hover {
      background: #45a049;
    }

    .btn-danger {
      background: #f44336;
      color: white;
    }

    .btn-danger:hover {
      background: #da190b;
    }

    .mission-info {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 8px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .label {
      font-weight: 600;
      color: #666;
    }

    .value {
      color: #333;
      font-weight: 500;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .status-pending {
      background: #ff9800;
      color: white;
    }

    .status-in-progress {
      background: #2196f3;
      color: white;
    }

    .status-completed {
      background: #4caf50;
      color: white;
    }

    .status-error {
      background: #f44336;
      color: white;
    }

    .container-ids {
      margin-top: 0.5rem;
    }

    .id-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .container-id {
      background: white;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9rem;
      border: 1px solid #e0e0e0;
    }

    .button-group {
      display: flex;
      gap: 0.5rem;
      margin-top: auto;
    }

    .button-group .btn {
      flex: 1;
    }
  `]
})
export class MissionPanelComponent {
  private rfidService = inject(RfidMockService);
  private threeSceneService = inject(ThreeSceneService);

  currentMission = signal<Mission | null>(null);
  targetLocation = 'A-5-3';
  containerCount = 3;
  loopAnimation = false; // Flag for animation looping

  startMission(): void {
    if (!this.targetLocation || this.containerCount < 1) {
      return;
    }

    const mission: Mission = {
      id: `MISSION-${Date.now()}`,
      targetLocation: this.targetLocation,
      containerCount: this.containerCount,
      containerIds: this.rfidService.generateContainerIds(this.containerCount),
      vehicleType: 'forklift',
      status: 'in-progress'
    };

    this.currentMission.set(mission);
    this.rfidService.setCurrentMission(mission);
    
    // Add containers to 3D scene
    this.threeSceneService.addContainers(this.containerCount);
    
    // Start mission animation with loop option
    this.threeSceneService.startMissionAnimation(this.targetLocation, this.loopAnimation);
  }

  completeMission(): void {
    const mission = this.currentMission();
    if (mission) {
      mission.status = 'completed';
      this.currentMission.set({ ...mission });
      
      // Stop animation
      this.threeSceneService.stopMissionAnimation();
      
      // Reset after a delay
      setTimeout(() => {
        this.resetMission();
      }, 2000);
    }
  }

  cancelMission(): void {
    // Stop animation
    this.threeSceneService.stopMissionAnimation();
    this.resetMission();
  }

  private resetMission(): void {
    this.currentMission.set(null);
    this.threeSceneService.addContainers(0);
  }
}
