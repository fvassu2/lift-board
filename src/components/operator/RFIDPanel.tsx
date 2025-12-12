import { useState, useEffect } from 'react';
import type { RFIDConnectionState, RFIDMessage, RFIDNotification } from '../../types/rfid';
import './RFIDPanel.css';

const RFIDPanel = () => {
  const [connectionState, setConnectionState] = useState<RFIDConnectionState>({
    status: 'DISCONNECTED'
  });
  const [messages] = useState<RFIDMessage[]>([]);
  const [notifications, setNotifications] = useState<RFIDNotification[]>([]);

  useEffect(() => {
    // Simulate RFID connection
    const connectRFID = () => {
      setTimeout(() => {
        setConnectionState({
          status: 'CONNECTED',
          readerName: 'RDR-01',
          lastHeartbeat: new Date().toISOString()
        });
        addNotification('success', 'Connessione RFID stabilita');
      }, 2000);
    };

    connectRFID();

    // Simulate heartbeat
    const heartbeatInterval = setInterval(() => {
      setConnectionState(prev => ({
        ...prev,
        lastHeartbeat: new Date().toISOString()
      }));
    }, 5000);

    return () => clearInterval(heartbeatInterval);
  }, []);

  const addNotification = (type: RFIDNotification['type'], message: string) => {
    const notification: RFIDNotification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString(),
      autoDismiss: true
    };
    
    setNotifications(prev => [...prev, notification]);

    if (notification.autoDismiss) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    }
  };

  const getStatusColor = () => {
    switch (connectionState.status) {
      case 'CONNECTED': return '#4CAF50';
      case 'DISCONNECTED': return '#F44336';
      case 'ERROR': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = () => {
    switch (connectionState.status) {
      case 'CONNECTED': return 'Connesso';
      case 'DISCONNECTED': return 'Disconnesso';
      case 'ERROR': return 'Errore';
      default: return 'Sconosciuto';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="rfid-panel">
      {/* Connection Status */}
      <section className="rfid-section status-section">
        <h3>🔌 STATO RFID</h3>
        <div className="status-indicator">
          <div 
            className="status-led" 
            style={{ backgroundColor: getStatusColor() }}
          />
          <span className="status-text">{getStatusText()}</span>
        </div>
        {connectionState.readerName && (
          <div className="reader-info">
            <span>Reader: {connectionState.readerName}</span>
          </div>
        )}
        {connectionState.lastHeartbeat && (
          <div className="heartbeat-info">
            <span>Ultimo heartbeat: {formatTime(connectionState.lastHeartbeat)}</span>
          </div>
        )}
      </section>

      {/* Message Stream */}
      <section className="rfid-section stream-section">
        <h3>📡 STREAM MESSAGGI</h3>
        <div className="message-stream">
          {messages.length === 0 ? (
            <div className="no-messages">Nessun messaggio</div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message-item ${msg.eventType.toLowerCase()}`}>
                <div className="message-time">{formatTime(msg.timestamp)}</div>
                <div className="message-content">
                  <span className={`event-badge ${msg.eventType.toLowerCase()}`}>
                    {msg.eventType}
                  </span>
                  <span className="tag-id">{msg.tagId}</span>
                  {msg.binId && <span className="bin-id">({msg.binId})</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Notifications */}
      <section className="rfid-section notifications-section">
        <h3>🔔 NOTIFICHE</h3>
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification ${notification.type}`}
            >
              <span className="notification-icon">
                {notification.type === 'success' && '✓'}
                {notification.type === 'warning' && '⚠'}
                {notification.type === 'error' && '✗'}
                {notification.type === 'info' && 'ℹ'}
              </span>
              <span className="notification-message">{notification.message}</span>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="no-notifications">Nessuna notifica</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RFIDPanel;
