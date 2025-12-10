/**
 * RFID scan result interface for validation feedback
 */
export interface RfidScanResult {
  containerId: string;
  timestamp: Date;
  isValid: boolean;
  expectedLocation: string;
  actualLocation?: string;
}
