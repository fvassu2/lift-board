import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forklift-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forklift-animation.component.html',
  styleUrls: ['./forklift-animation.component.scss']
})
export class ForkliftAnimationComponent {
  @Input() state: 'idle' | 'moving' | 'lifting' | 'lowering' | 'error' = 'idle';
  @Input() batteryLevel: number = 100; // 0-100
  @Input() loadWeight: number = 0; // kg
  @Input() forkHeight: number = 0; // 0-100 percentage of fork height

  /**
   * Get battery color based on level
   */
  getBatteryColor(): string {
    if (this.batteryLevel > 50) return '#4ade80'; // green
    if (this.batteryLevel >= 20) return '#fbbf24'; // yellow
    return '#ef4444'; // red
  }

  /**
   * Calculate fork Y position based on height percentage
   */
  getForkYPosition(): number {
    // Fork height: 0% = 120 (bottom), 100% = 40 (top)
    return 120 - (this.forkHeight * 0.8);
  }

  /**
   * Check if forklift has a load
   */
  hasLoad(): boolean {
    return this.loadWeight > 0;
  }
}
