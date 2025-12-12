export type RFIDEventType = 'READ' | 'WRITE' | 'ERROR';

export type RFIDConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

export interface RFIDMessage {
  timestamp: string;
  tagId: string;
  eventType: RFIDEventType;
  readerName: string;
  binId?: string;
  articleCode?: string;
}

export interface RFIDConnectionState {
  status: RFIDConnectionStatus;
  readerName?: string;
  lastHeartbeat?: string;
}

export interface RFIDNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  autoDismiss?: boolean;
}
