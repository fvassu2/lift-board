import { Camera, Keyboard, RefreshCw, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { RFIDStatus, NotificationType } from '../../types';

export const ManualToolbar = () => {
  const { 
    rfidConnection, 
    setManualMode, 
    manualOperationsCount, 
    rfidOperationsCount,
    currentMission,
    completeBin,
    addNotification,
    setRFIDConnection
  } = useStore();
  
  const [manualInput, setManualInput] = useState('');
  const [selectedBinId, setSelectedBinId] = useState('');

  const isRFIDDisconnected = rfidConnection.status !== RFIDStatus.CONNECTED;

  const handleManualScan = () => {
    addNotification({
      type: NotificationType.INFO,
      message: 'Funzione scan barcode non ancora implementata',
      timestamp: new Date().toISOString(),
    });
  };

  const handleManualInput = () => {
    if (!manualInput.trim()) {
      addNotification({
        type: NotificationType.WARNING,
        message: 'Inserisci un codice bin valido',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const bin = currentMission?.bins.find(b => b.code === manualInput.trim());
    if (bin) {
      completeBin(bin.id);
      addNotification({
        type: NotificationType.SUCCESS,
        message: `Bin ${bin.code} completato manualmente`,
        timestamp: new Date().toISOString(),
      });
      setManualInput('');
    } else {
      addNotification({
        type: NotificationType.ERROR,
        message: 'Bin non trovato nella missione corrente',
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleChangeBinStatus = () => {
    if (!selectedBinId) {
      addNotification({
        type: NotificationType.WARNING,
        message: 'Seleziona un bin',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    completeBin(selectedBinId);
    addNotification({
      type: NotificationType.SUCCESS,
      message: 'Stato bin aggiornato',
      timestamp: new Date().toISOString(),
    });
    setSelectedBinId('');
  };

  const handleReconnectRFID = () => {
    addNotification({
      type: NotificationType.INFO,
      message: 'Tentativo di riconnessione RFID...',
      timestamp: new Date().toISOString(),
    });

    // Simulate reconnection attempt
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      if (success) {
        setRFIDConnection({
          status: RFIDStatus.CONNECTED,
          readerName: 'RDR-01',
          lastHeartbeat: new Date().toISOString(),
        });
        addNotification({
          type: NotificationType.SUCCESS,
          message: 'Connessione RFID ripristinata',
          timestamp: new Date().toISOString(),
        });
        setManualMode(false);
      } else {
        addNotification({
          type: NotificationType.ERROR,
          message: 'Riconnessione RFID fallita',
          timestamp: new Date().toISOString(),
        });
      }
    }, 2000);
  };

  return (
    <div className="bg-white border-t-4 border-primary-500 shadow-lg p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            🔧 Toolbar Backup
          </h3>
          {isRFIDDisconnected && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              🔴 Modalità Manuale Attiva
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {/* Manual Barcode Scan */}
          <button
            onClick={handleManualScan}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors touch-manipulation min-h-[44px]"
          >
            <Camera size={20} />
            Scan Barcode
          </button>

          {/* Manual Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualInput()}
              placeholder="Codice bin..."
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none text-sm min-h-[44px]"
            />
            <button
              onClick={handleManualInput}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Inserisci"
            >
              <Keyboard size={20} />
            </button>
          </div>

          {/* Change Bin Status */}
          <div className="flex gap-2">
            <select
              value={selectedBinId}
              onChange={(e) => setSelectedBinId(e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none text-sm min-h-[44px]"
            >
              <option value="">Seleziona bin...</option>
              {currentMission?.bins.map((bin) => (
                <option key={bin.id} value={bin.id}>
                  {bin.code} - {bin.status}
                </option>
              ))}
            </select>
            <button
              onClick={handleChangeBinStatus}
              disabled={!selectedBinId}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-4 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Cambia stato"
            >
              <CheckSquare size={20} />
            </button>
          </div>

          {/* Reconnect RFID */}
          <button
            onClick={handleReconnectRFID}
            disabled={!isRFIDDisconnected}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors touch-manipulation min-h-[44px]"
          >
            <RefreshCw size={20} />
            Riconnetti RFID
          </button>
        </div>

        {/* Operation Counters */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            Operazioni Manuali: <span className="font-bold text-amber-600">{manualOperationsCount}</span>
          </span>
          <span className="text-gray-400">|</span>
          <span>
            Operazioni RFID: <span className="font-bold text-green-600">{rfidOperationsCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
