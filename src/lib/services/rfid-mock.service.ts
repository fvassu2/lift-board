import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RfidScanResult, Mission } from '../models';

/**
 * Mock RFID service for simulating container scanning and validation
 */
@Injectable({
  providedIn: 'root'
})
export class RfidMockService {
  private scanSubject = new Subject<RfidScanResult>();
  private currentMission: Mission | null = null;

  /**
   * Observable stream of RFID scan results
   */
  get scans$(): Observable<RfidScanResult> {
    return this.scanSubject.asObservable();
  }

  /**
   * Set the current mission for validation
   */
  setCurrentMission(mission: Mission): void {
    this.currentMission = mission;
  }

  /**
   * Simulate scanning a container
   */
  scanContainer(containerId: string, scannedLocation: string): void {
    if (!this.currentMission) {
      console.warn('No active mission set for validation');
      return;
    }

    const isValidContainer = this.currentMission.containerIds.includes(containerId);
    const isValidLocation = scannedLocation === this.currentMission.targetLocation;
    const isValid = isValidContainer && isValidLocation;

    const result: RfidScanResult = {
      containerId,
      timestamp: new Date(),
      isValid,
      expectedLocation: this.currentMission.targetLocation,
      actualLocation: scannedLocation
    };

    this.scanSubject.next(result);
  }

  /**
   * Simulate a random container scan (for testing)
   */
  simulateScan(forceSuccess: boolean = false): void {
    if (!this.currentMission) {
      console.warn('No active mission set for simulation');
      return;
    }

    let containerId: string;
    let scannedLocation: string;

    if (forceSuccess) {
      // Generate a successful scan
      containerId = this.currentMission.containerIds[0] || 'CONT-001';
      scannedLocation = this.currentMission.targetLocation;
    } else {
      // Random scan - might be correct or incorrect
      const random = Math.random();
      if (random > 0.5 && this.currentMission.containerIds.length > 0) {
        // Correct container
        containerId = this.currentMission.containerIds[Math.floor(Math.random() * this.currentMission.containerIds.length)];
      } else {
        // Wrong container
        containerId = `CONT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      }

      if (Math.random() > 0.5) {
        // Correct location
        scannedLocation = this.currentMission.targetLocation;
      } else {
        // Wrong location
        const wrongLocations = ['A-1-1', 'B-2-3', 'C-5-7', 'D-3-2'];
        scannedLocation = wrongLocations[Math.floor(Math.random() * wrongLocations.length)];
      }
    }

    this.scanContainer(containerId, scannedLocation);
  }

  /**
   * Generate test container IDs for a mission
   */
  generateContainerIds(count: number): string[] {
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      ids.push(`CONT-${(i + 1).toString().padStart(3, '0')}`);
    }
    return ids;
  }
}
