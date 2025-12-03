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
  template: `
    <div class="rfid-validator">
      <h2>RFID Scanner</h2>
      
      <div class="scan-controls">
        <button 
          class="btn btn-scan"
          (click)="simulateScan(false)">
          Simulate Scan
        </button>
        <button 
          class="btn btn-scan-success"
          (click)="simulateScan(true)">
          Simulate Success
        </button>
      </div>

      @if (lastScan) {
        <div 
          class="scan-result"
          [class.valid]="lastScan.isValid"
          [class.invalid]="!lastScan.isValid">
          
          <div class="result-icon">
            {{ lastScan.isValid ? '✅' : '❌' }}
          </div>
          
          <div class="result-status">
            {{ lastScan.isValid ? 'VALID SCAN' : 'INVALID SCAN' }}
          </div>
          
          <div class="result-details">
            <div class="detail-row">
              <span class="detail-label">Container ID:</span>
              <span class="detail-value">{{ lastScan.containerId }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Expected Location:</span>
              <span class="detail-value">{{ lastScan.expectedLocation }}</span>
            </div>
            
            @if (lastScan.actualLocation) {
              <div class="detail-row">
                <span class="detail-label">Scanned Location:</span>
                <span class="detail-value">{{ lastScan.actualLocation }}</span>
              </div>
            }
            
            <div class="detail-row">
              <span class="detail-label">Timestamp:</span>
              <span class="detail-value">{{ formatTime(lastScan.timestamp) }}</span>
            </div>
          </div>
        </div>
      } @else {
        <div class="no-scan">
          <p>No scans yet</p>
          <p class="hint">Click "Simulate Scan" to test the system</p>
        </div>
      }

      @if (scanHistory.length > 0) {
        <div class="scan-history">
          <h3>Recent Scans</h3>
          <div class="history-list">
            @for (scan of scanHistory; track scan.timestamp) {
              <div class="history-item" [class.valid]="scan.isValid">
                <span class="history-icon">{{ scan.isValid ? '✅' : '❌' }}</span>
                <span class="history-id">{{ scan.containerId }}</span>
                <span class="history-time">{{ formatTime(scan.timestamp) }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .rfid-validator {
      padding: 1rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: #555;
    }

    .scan-controls {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 44px;
    }

    .btn-scan {
      background: #2196f3;
      color: white;
    }

    .btn-scan:hover {
      background: #1976d2;
    }

    .btn-scan-success {
      background: #4caf50;
      color: white;
    }

    .btn-scan-success:hover {
      background: #45a049;
    }

    .scan-result {
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-10px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .scan-result.valid {
      background: #4caf50;
      color: white;
    }

    .scan-result.invalid {
      background: #f44336;
      color: white;
    }

    .result-icon {
      font-size: 4rem;
      margin-bottom: 0.5rem;
    }

    .result-status {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .result-details {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 1rem;
      text-align: left;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-weight: 600;
    }

    .detail-value {
      font-family: monospace;
    }

    .no-scan {
      padding: 2rem;
      text-align: center;
      background: #f5f5f5;
      border-radius: 8px;
      color: #666;
    }

    .no-scan p {
      margin: 0.5rem 0;
    }

    .hint {
      font-size: 0.9rem;
      color: #999;
    }

    .scan-history {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .history-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: #f5f5f5;
      border-radius: 4px;
      border-left: 3px solid #f44336;
    }

    .history-item.valid {
      border-left-color: #4caf50;
    }

    .history-icon {
      font-size: 1.2rem;
    }

    .history-id {
      flex: 1;
      font-family: monospace;
      font-size: 0.9rem;
    }

    .history-time {
      font-size: 0.8rem;
      color: #666;
    }
  `]
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
