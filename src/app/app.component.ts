import { Component } from '@angular/core';
import { VehicleSelectorComponent, Scene3dComponent, MissionPanelComponent, RfidValidatorComponent } from '../lib/components';

@Component({
  selector: 'app-root',
  imports: [
    VehicleSelectorComponent,
    Scene3dComponent,
    MissionPanelComponent,
    RfidValidatorComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Lift Board - Warehouse Dashboard';
}
