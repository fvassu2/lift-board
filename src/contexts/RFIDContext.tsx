import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { RFIDMessage, RFIDConnectionStatus } from '../types';
import { RFIDContext, type RFIDContextType } from './RFIDContextDefinition';

interface RFIDProviderProps {
  children: ReactNode;
}

export const RFIDProvider: React.FC<RFIDProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<RFIDConnectionStatus>('disconnected');
  const [messages, setMessages] = useState<RFIDMessage[]>([]);
  const [lastHeartbeat, setLastHeartbeat] = useState<string>();

  const addMessage = useCallback((message: Omit<RFIDMessage, 'id' | 'timestamp'>) => {
    const newMessage: RFIDMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage].slice(-50)); // Keep last 50 messages
  }, []);

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
      setStatus((currentStatus) => {
        if (currentStatus === 'connected') {
          setLastHeartbeat(new Date().toISOString());
        }
        return currentStatus;
      });
    }, 5000);

    return () => {
      clearTimeout(connectTimeout);
      clearInterval(heartbeatInterval);
    };
  }, [addMessage]);

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
