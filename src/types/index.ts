// Mission Types
export const MissionType = {
  IN_ENTRATA: 'IN_ENTRATA',
  IN_USCITA: 'IN_USCITA'
} as const;

export type MissionType = typeof MissionType[keyof typeof MissionType];

export const MissionPriority = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
} as const;

export type MissionPriority = typeof MissionPriority[keyof typeof MissionPriority];

export const MissionStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

export type MissionStatus = typeof MissionStatus[keyof typeof MissionStatus];

export interface Article {
  code: string;
  description: string;
  photoUrl?: string;
}

export interface Bin {
  id: string;
  code: string;
  quantity: number;
  status: 'PENDING' | 'IN_LOADING' | 'LOADED' | 'UNLOADING' | 'UNLOADED';
  rfidTag?: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'CELL' | 'YARD' | 'PRODUCTION_LINE';
  warehouse?: string;
}

export interface Mission {
  id: string;
  code: string;
  type: MissionType;
  status: MissionStatus;
  priority: MissionPriority;
  article: Article;
  bins: Bin[];
  origin: Location;
  destination: Location;
  assignedOperator?: string;
  estimatedTime?: number; // in minutes
  startTime?: string;
  completedTime?: string;
  progress: {
    completed: number;
    total: number;
  };
}

// RFID Types
export const RFIDEventType = {
  READ: 'READ',
  WRITE: 'WRITE',
  ERROR: 'ERROR'
} as const;

export type RFIDEventType = typeof RFIDEventType[keyof typeof RFIDEventType];

export const RFIDStatus = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR'
} as const;

export type RFIDStatus = typeof RFIDStatus[keyof typeof RFIDStatus];

export interface RFIDMessage {
  timestamp: string;
  tagId: string;
  eventType: RFIDEventType;
  readerName: string;
  binId?: string;
  articleCode?: string;
}

export interface RFIDConnection {
  status: RFIDStatus;
  readerName?: string;
  lastHeartbeat?: string;
}

// Animation Types
export const AnimationState = {
  IDLE: 'idle',
  MOVING_TO_ORIGIN: 'moving_to_origin',
  LOADING: 'loading',
  MOVING_TO_DEST: 'moving_to_dest',
  UNLOADING: 'unloading',
  RETURNING: 'returning',
  COMPLETED: 'completed'
} as const;

export type AnimationState = typeof AnimationState[keyof typeof AnimationState];

// Notification Types
export const NotificationType = {
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  INFO: 'INFO'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  autoClose?: boolean;
  duration?: number; // in milliseconds
}

// Operator Types
export interface Operator {
  id: string;
  name: string;
  shift?: string;
  startTime?: string;
}
