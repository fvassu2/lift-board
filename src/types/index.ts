export type MissionType = 'IN' | 'OUT';
export type MissionPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type MissionStatus = 'UNASSIGNED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Article {
  code: string;
  description: string;
  imageUrl?: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'warehouse' | 'zone' | 'line';
}

export interface Mission {
  id: string;
  type: MissionType;
  priority: MissionPriority;
  status: MissionStatus;
  article: Article;
  from: Location;
  to: Location;
  binsTotal: number;
  binsCompleted: number;
  quantityKg: number;
  assignedTo?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export type RFIDConnectionStatus = 'connected' | 'unstable' | 'disconnected';

export interface RFIDMessage {
  id: string;
  type: 'tag_read' | 'connection_status' | 'scan_confirmation' | 'error';
  timestamp: string;
  content: string;
  level: 'info' | 'success' | 'warning' | 'error';
  tagId?: string;
  readerId?: string;
  binId?: string;
}

export interface RFIDState {
  status: RFIDConnectionStatus;
  messages: RFIDMessage[];
  lastHeartbeat?: string;
}

export interface Operator {
  id: string;
  name: string;
  deviceId: string;
}

export type AnimationState = 'idle' | 'moving_to_pickup' | 'picking_up' | 'moving_to_delivery' | 'delivering' | 'complete';
