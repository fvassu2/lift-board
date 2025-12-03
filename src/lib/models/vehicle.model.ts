/**
 * Vehicle interface representing different warehouse vehicle types
 */
export interface Vehicle {
  id: string;
  name: string;
  type: 'forklift' | 'pallet-jack' | 'stacker';
  maxCapacity: number;
  icon?: string;
}
