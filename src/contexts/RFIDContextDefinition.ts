import { createContext } from 'react';
import type { RFIDState, RFIDMessage, RFIDConnectionStatus } from '../types';

export interface RFIDContextType extends RFIDState {
  addMessage: (message: Omit<RFIDMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  updateStatus: (status: RFIDConnectionStatus) => void;
}

export const RFIDContext = createContext<RFIDContextType | undefined>(undefined);
