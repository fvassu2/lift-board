import { useState } from 'react';
import './ManualToolbar.css';

const ManualToolbar = () => {
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [selectedBin, setSelectedBin] = useState('');

  const handleScanBarcode = () => {
    console.log('Opening camera for barcode scan...');
    // In a real implementation, this would open the device camera
    alert('Funzionalità scanner barcode - Richiede accesso fotocamera');
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      console.log('Manual input:', manualInput);
      alert(`Inserito manualmente: ${manualInput}`);
      setManualInput('');
    }
  };

  const handleChangeBinStatus = () => {
    if (selectedBin) {
      console.log('Change bin status:', selectedBin);
      alert(`Cambia stato bin: ${selectedBin}`);
    }
  };

  const handleReconnectRFID = () => {
    console.log('Reconnecting RFID...');
    setManualMode(false);
    alert('Tentativo di riconnessione RFID...');
  };

  return (
    <div className="manual-toolbar">
      <div className="toolbar-actions">
        <button 
          className="toolbar-btn" 
          onClick={handleScanBarcode}
          title="Scan Manuale Barcode"
        >
          📷 Scan Barcode
        </button>

        <div className="manual-input-group">
          <input
            type="text"
            className="manual-input"
            placeholder="Inserisci codice bin/articolo"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
          />
          <button 
            className="toolbar-btn" 
            onClick={handleManualSubmit}
            title="Conferma Inserimento"
          >
            ⌨️ Conferma
          </button>
        </div>

        <div className="bin-status-group">
          <select
            className="bin-select"
            value={selectedBin}
            onChange={(e) => setSelectedBin(e.target.value)}
          >
            <option value="">Seleziona bin...</option>
            <option value="BIN001">BIN001</option>
            <option value="BIN002">BIN002</option>
            <option value="BIN003">BIN003</option>
          </select>
          <button 
            className="toolbar-btn" 
            onClick={handleChangeBinStatus}
            disabled={!selectedBin}
            title="Cambia Stato Bin"
          >
            ✓ Cambia Stato
          </button>
        </div>

        <button 
          className="toolbar-btn btn-reconnect" 
          onClick={handleReconnectRFID}
          title="Riconnetti RFID"
        >
          🔄 Riconnetti RFID
        </button>
      </div>

      {manualMode && (
        <div className="manual-mode-indicator">
          <span className="indicator-badge">🔴 Modalità Manuale Attiva</span>
          <span className="operations-counter">Operazioni manuali: 3 | RFID: 12</span>
        </div>
      )}
    </div>
  );
};

export default ManualToolbar;
