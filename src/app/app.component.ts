import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForkliftAnimationComponent } from './components/forklift-animation/forklift-animation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ForkliftAnimationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Lift Board - Forklift Control Panel';
  
  // Forklift state
  forkliftState: 'idle' | 'moving' | 'lifting' | 'lowering' | 'error' = 'idle';
  batteryLevel: number = 85;
  loadWeight: number = 0;
  forkHeight: number = 0;

  /**
   * Set the forklift state
   */
  setState(state: 'idle' | 'moving' | 'lifting' | 'lowering' | 'error'): void {
    this.forkliftState = state;
  }

  /**
   * Check if a state is active
   */
  isStateActive(state: string): boolean {
    return this.forkliftState === state;
  }
}
