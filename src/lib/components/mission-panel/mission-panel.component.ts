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
  templateUrl: './mission-panel.component.html',
  styleUrls: ['./mission-panel.component.scss']
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
