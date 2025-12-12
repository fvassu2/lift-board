import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../services';
import { Vehicle } from '../../models';

/**
 * Vehicle selector component - displays available vehicles for selection
 */
@Component({
  selector: 'app-vehicle-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-selector.component.html',
  styleUrls: ['./vehicle-selector.component.scss']
})
export class VehicleSelectorComponent {
  private vehicleService = inject(VehicleService);

  vehicles = this.vehicleService.getVehicles();
  selectedVehicle = this.vehicleService.getSelectedVehicle();

  onSelect(vehicle: Vehicle): void {
    this.vehicleService.selectVehicle(vehicle.id);
  }

  isSelected(vehicle: Vehicle): boolean {
    return this.selectedVehicle()?.id === vehicle.id;
  }
}
