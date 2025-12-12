import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { RFIDState, RFIDMessage, RFIDConnectionStatus } from '../types';

interface RFIDContextType extends RFIDState {
  addMessage: (message: Omit<RFIDMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  updateStatus: (status: RFIDConnectionStatus) => void;
}

const RFIDContext = createContext<RFIDContextType | undefined>(undefined);

export const useRFIDContext = () => {
  const context = useContext(RFIDContext);
  if (!context) {
    throw new Error('useRFIDContext must be used within RFIDProvider');
  }
  return context;
};

interface RFIDProviderProps {
  children: ReactNode;
}

export const RFIDProvider: React.FC<RFIDProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<RFIDConnectionStatus>('disconnected');
  const [messages, setMessages] = useState<RFIDMessage[]>([]);
  const [lastHeartbeat, setLastHeartbeat] = useState<string>();

  // Simulate WebSocket connection for demo purposes
  useEffect(() => {
    // Simulate connecting after 1 second
    const connectTimeout = setTimeout(() => {
      setStatus('connected');
      setLastHeartbeat(new Date().toISOString());
      
      // Add initial connection message
      addMessage({
        type: 'connection_status',
        content: 'RFID reader connected',
        level: 'success',
      });
    }, 1000);

    // Simulate heartbeat every 5 seconds
    const heartbeatInterval = setInterval(() => {
      if (status === 'connected') {
        setLastHeartbeat(new Date().toISOString());
      }
    }, 5000);

    return () => {
      clearTimeout(connectTimeout);
      clearInterval(heartbeatInterval);
    };
  }, []);

  const addMessage = useCallback((message: Omit<RFIDMessage, 'id' | 'timestamp'>) => {
    const newMessage: RFIDMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage].slice(-50)); // Keep last 50 messages
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const updateStatus = useCallback((newStatus: RFIDConnectionStatus) => {
    setStatus(newStatus);
    if (newStatus === 'connected') {
      setLastHeartbeat(new Date().toISOString());
    }
  }, []);

  const value: RFIDContextType = {
    status,
    messages,
    lastHeartbeat,
    addMessage,
    clearMessages,
    updateStatus,
  };

  return <RFIDContext.Provider value={value}>{children}</RFIDContext.Provider>;
};
