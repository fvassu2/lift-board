import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RfidMockService } from '../../services';
import { RfidScanResult } from '../../models';

/**
 * RFID validator component - displays scan results and validation feedback
 */
@Component({
  selector: 'app-rfid-validator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rfid-validator.component.html',
  styleUrls: ['./rfid-validator.component.scss']
})
export class RfidValidatorComponent implements OnInit, OnDestroy {
  private rfidService = inject(RfidMockService);
  private subscription?: Subscription;

  lastScan: RfidScanResult | null = null;
  scanHistory: RfidScanResult[] = [];

  ngOnInit(): void {
    this.subscription = this.rfidService.scans$.subscribe(scan => {
      this.lastScan = scan;
      this.scanHistory.unshift(scan);
      
      // Keep only last 10 scans
      if (this.scanHistory.length > 10) {
        this.scanHistory = this.scanHistory.slice(0, 10);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  simulateScan(forceSuccess: boolean): void {
    this.rfidService.simulateScan(forceSuccess);
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString();
  }
}
