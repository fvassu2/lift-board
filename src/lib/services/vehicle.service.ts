import { Injectable, signal } from '@angular/core';
import { Vehicle } from '../models';

/**
 * Service to manage vehicle types and selection
 */
@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly vehicles: Vehicle[] = [
    {
      id: 'forklift-1',
      name: 'Forklift',
      type: 'forklift',
      maxCapacity: 2000,
      icon: '🚜'
    },
    {
      id: 'pallet-jack-1',
      name: 'Pallet Jack',
      type: 'pallet-jack',
      maxCapacity: 1000,
      icon: '🛒'
    },
    {
      id: 'stacker-1',
      name: 'Stacker',
      type: 'stacker',
      maxCapacity: 1500,
      icon: '📦'
    }
  ];

  // Use Angular signals for reactive state management
  private selectedVehicleSignal = signal<Vehicle | null>(null);

  /**
   * Get all available vehicles
   */
  getVehicles(): Vehicle[] {
    return [...this.vehicles];
  }

  /**
   * Get the currently selected vehicle as a signal
   */
  getSelectedVehicle() {
    return this.selectedVehicleSignal.asReadonly();
  }

  /**
   * Select a vehicle by ID
   */
  selectVehicle(vehicleId: string): void {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      this.selectedVehicleSignal.set(vehicle);
    }
  }

  /**
   * Clear the selected vehicle
   */
  clearSelection(): void {
    this.selectedVehicleSignal.set(null);
  }
}
