import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForkliftKawaiiComponent } from './components/forklift-kawaii/forklift-kawaii.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ForkliftKawaiiComponent],
  template: `
    <div style="padding: 20px;">
      <h1>Lift Board - Forklift Panel</h1>
      
      <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px;">
        <div>
          <h3>Idle State</h3>
          <app-forklift-kawaii
            [state]="'idle'"
            [direction]="'right'"
            [batteryLevel]="100">
          </app-forklift-kawaii>
        </div>
        
        <div>
          <h3>Moving State</h3>
          <app-forklift-kawaii
            [state]="'moving'"
            [direction]="'right'"
            [batteryLevel]="75"
            [currentMission]="'Prelievo scaffale A-12'"
            [operatorName]="'Mario Rossi'">
          </app-forklift-kawaii>
        </div>
        
        <div>
          <h3>Loading State</h3>
          <app-forklift-kawaii
            [state]="'loading'"
            [direction]="'left'"
            [batteryLevel]="60">
          </app-forklift-kawaii>
        </div>
        
        <div>
          <h3>Unloading State</h3>
          <app-forklift-kawaii
            [state]="'unloading'"
            [direction]="'right'"
            [batteryLevel]="45">
          </app-forklift-kawaii>
        </div>
        
        <div>
          <h3>Error State</h3>
          <app-forklift-kawaii
            [state]="'error'"
            [direction]="'right'"
            [batteryLevel]="30">
          </app-forklift-kawaii>
        </div>
        
        <div>
          <h3>Low Battery (Idle)</h3>
          <app-forklift-kawaii
            [state]="'idle'"
            [direction]="'left'"
            [batteryLevel]="15">
          </app-forklift-kawaii>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 {
      color: #ff6b9d;
      text-align: center;
    }
    h3 {
      margin-bottom: 10px;
      color: #666;
    }
  `]
})
export class AppComponent {
  title = 'lift-board';
}
