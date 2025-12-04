import { Injectable, signal } from '@angular/core';
import { Vehicle } from '../models';

/**
 * Service to manage vehicle types and selection
 * Vehicle configurations are loaded from vehicles-config.json
 */
@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehicles: Vehicle[] = [];
  private vehiclesLoaded = false;

  // Use Angular signals for reactive state management
  private selectedVehicleSignal = signal<Vehicle | null>(null);

  constructor() {
    this.loadVehicleConfigurations();
  }

  /**
   * Load vehicle configurations from JSON file
   */
  private async loadVehicleConfigurations(): Promise<void> {
    try {
      const response = await fetch('assets/models/vehicles-config.json');
      if (response.ok) {
        this.vehicles = await response.json();
        this.vehiclesLoaded = true;
        console.log('✅ Vehicle configurations loaded:', this.vehicles.length, 'vehicles');
      } else {
        console.warn('⚠️ Could not load vehicles-config.json, using default configuration');
        this.useDefaultVehicles();
      }
    } catch (error) {
      console.warn('⚠️ Error loading vehicles-config.json, using default configuration:', error);
      this.useDefaultVehicles();
    }
  }

  /**
   * Fallback to default vehicle configuration if JSON loading fails
   */
  private useDefaultVehicles(): void {
    this.vehicles = [
      {
        id: 'forklift-1',
        name: 'Forklift',
        type: 'forklift',
        maxCapacity: 2000,
        icon: '🚜',
        modelConfig: {
          filename: 'forklift.glb',
          rotation: { x: 0, y: 0, z: 0 },
          translation: { x: 0, y: 0, z: 0 }
        }
      },
      {
        id: 'pallet-jack-1',
        name: 'Pallet Jack',
        type: 'pallet-jack',
        maxCapacity: 1000,
        icon: '🛒',
        modelConfig: {
          filename: 'pallet-jack.glb',
          rotation: { x: 0, y: -90, z: 0 },
          translation: { x: 0, y: 0, z: 0 }
        }
      },
      {
        id: 'stacker-1',
        name: 'Stacker',
        type: 'stacker',
        maxCapacity: 1500,
        icon: '📦',
        modelConfig: {
          filename: 'stacker.glb',
          rotation: { x: 0, y: 0, z: 0 },
          translation: { x: 0, y: 0, z: 0 }
        }
      }
    ];
    this.vehiclesLoaded = true;
  }

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
