import React, { useEffect, useRef } from 'react';
import { useRFIDContext } from '../../contexts/RFIDContext';
import { Wifi, WifiOff, AlertTriangle, Trash2 } from 'lucide-react';
import type { RFIDConnectionStatus } from '../../types';

const RFIDPanel: React.FC = () => {
  const { status, messages, lastHeartbeat, clearMessages } = useRFIDContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getStatusConfig = (status: RFIDConnectionStatus) => {
    switch (status) {
      case 'connected':
        return {
          icon: <Wifi size={20} />,
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          label: 'Connesso',
        };
      case 'unstable':
        return {
          icon: <AlertTriangle size={20} />,
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          label: 'Instabile',
        };
      case 'disconnected':
        return {
          icon: <WifiOff size={20} />,
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          label: 'Disconnesso',
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getMessageStyles = (level: string) => {
    switch (level) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">RFID Monitor</h3>

      {/* Connection Status */}
      <div className={`${statusConfig.bgColor} rounded-lg p-4 mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`${statusConfig.color} text-white p-2 rounded-full`}>
              {statusConfig.icon}
            </div>
            <span className={`font-semibold ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
          <div className={`w-3 h-3 rounded-full ${statusConfig.color} animate-pulse`}></div>
        </div>
        {lastHeartbeat && (
          <div className="text-xs text-gray-600">
            Ultimo heartbeat: {formatTime(lastHeartbeat)}
          </div>
        )}
      </div>

      {/* Messages Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 uppercase">
          Stream Messaggi ({messages.length})
        </h4>
        <button
          onClick={clearMessages}
          className="p-2 hover:bg-gray-100 rounded transition-colors touch-manipulation"
          title="Cancella messaggi"
        >
          <Trash2 size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Nessun messaggio
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`border rounded-lg p-3 ${getMessageStyles(message.level)}`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-semibold uppercase">
                  {message.type.replace('_', ' ')}
                </span>
                <span className="text-xs">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
              {message.tagId && (
                <p className="text-xs mt-1 opacity-75">Tag: {message.tagId}</p>
              )}
              {message.binId && (
                <p className="text-xs opacity-75">Bin: {message.binId}</p>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t space-y-2">
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors touch-manipulation">
          Simula Scan Tag
        </button>
        <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors touch-manipulation">
          Reconnect RFID
        </button>
      </div>
    </div>
  );
};

export default RFIDPanel;
