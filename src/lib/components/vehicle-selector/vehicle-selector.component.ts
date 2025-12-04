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
  template: `
    <div class="vehicle-selector">
      <h2>Select Vehicle</h2>
      <div class="vehicle-grid">
        @for (vehicle of vehicles; track vehicle.id) {
          <button 
            class="vehicle-card"
            [class.selected]="isSelected(vehicle)"
            (click)="onSelect(vehicle)">
            <div class="vehicle-icon">{{ vehicle.icon }}</div>
            <div class="vehicle-name">{{ vehicle.name }}</div>
            <div class="vehicle-capacity">
              Capacity: {{ vehicle.maxCapacity }}kg
            </div>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .vehicle-selector {
      padding: 1rem;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .vehicle-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .vehicle-card {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      min-height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .vehicle-card:hover {
      border-color: #2196f3;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .vehicle-card.selected {
      border-color: #2196f3;
      background: #e3f2fd;
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
    }

    .vehicle-icon {
      font-size: 3rem;
      line-height: 1;
    }

    .vehicle-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }

    .vehicle-capacity {
      font-size: 0.9rem;
      color: #666;
    }
  `]
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
