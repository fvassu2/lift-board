import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { RFIDStatus as RFIDStatusType } from '../../types';

export const RFIDStatus = () => {
  const { rfidConnection } = useStore();

  const getStatusIcon = () => {
    switch (rfidConnection.status) {
      case RFIDStatusType.CONNECTED:
        return <Wifi className="text-green-500" size={24} />;
      case RFIDStatusType.ERROR:
        return <AlertCircle className="text-red-500" size={24} />;
      default:
        return <WifiOff className="text-gray-400" size={24} />;
    }
  };

  const getStatusText = () => {
    switch (rfidConnection.status) {
      case RFIDStatusType.CONNECTED:
        return 'Connesso';
      case RFIDStatusType.ERROR:
        return 'Errore';
      default:
        return 'Disconnesso';
    }
  };

  const getStatusColor = () => {
    switch (rfidConnection.status) {
      case RFIDStatusType.CONNECTED:
        return 'text-green-700';
      case RFIDStatusType.ERROR:
        return 'text-red-700';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {getStatusIcon()}
        <h3 className="text-lg font-bold text-gray-800">Stato RFID</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            rfidConnection.status === RFIDStatusType.CONNECTED ? 'bg-green-500' :
            rfidConnection.status === RFIDStatusType.ERROR ? 'bg-red-500' :
            'bg-gray-400'
          }`} />
          <span className={`font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        {rfidConnection.readerName && (
          <div className="text-sm text-gray-600">
            Reader: <span className="font-semibold">{rfidConnection.readerName}</span>
          </div>
        )}
        {rfidConnection.lastHeartbeat && (
          <div className="text-xs text-gray-500">
            Ultimo heartbeat: {new Date(rfidConnection.lastHeartbeat).toLocaleTimeString('it-IT')}
          </div>
        )}
      </div>
    </div>
  );
};
