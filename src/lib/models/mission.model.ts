/**
 * Mission interface representing a warehouse operation task
 */
export interface Mission {
  id: string;
  targetLocation: string; // e.g., "A-5-3"
  containerCount: number;
  containerIds: string[]; // Expected RFID tags
  vehicleType: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}
