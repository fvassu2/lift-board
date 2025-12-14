import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { RFIDStatus, RFIDEventType } from '../types';

export const useRFIDSimulation = () => {
  const { setRFIDConnection, addRFIDMessage, currentMission } = useStore();

  useEffect(() => {
    // Simulate initial connection
    setTimeout(() => {
      setRFIDConnection({
        status: RFIDStatus.CONNECTED,
        readerName: 'RDR-01',
        lastHeartbeat: new Date().toISOString(),
      });
    }, 2000);

    // Simulate periodic heartbeat
    const heartbeatInterval = setInterval(() => {
      setRFIDConnection({
        status: RFIDStatus.CONNECTED,
        readerName: 'RDR-01',
        lastHeartbeat: new Date().toISOString(),
      });
    }, 10000);

    // Simulate random RFID messages
    const messageInterval = setInterval(() => {
      if (currentMission && Math.random() > 0.5) {
        const bins = currentMission.bins.filter(b => b.rfidTag);
        if (bins.length > 0) {
          const randomBin = bins[Math.floor(Math.random() * bins.length)];
          addRFIDMessage({
            timestamp: new Date().toISOString(),
            tagId: randomBin.rfidTag!,
            eventType: RFIDEventType.READ,
            readerName: 'RDR-01',
            binId: randomBin.code,
            articleCode: currentMission.article.code,
          });
        }
      }
    }, 15000);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(messageInterval);
    };
  }, [currentMission, setRFIDConnection, addRFIDMessage]);
};
