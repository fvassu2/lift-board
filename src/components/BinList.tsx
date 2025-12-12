import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { filterBins } from '../utils/filters';
import './BinList.css';

export const BinList = () => {
  const bins = useStore((state) => state.bins);
  const binFilter = useStore((state) => state.binFilter);
  const selectedBins = useStore((state) => state.selectedBins);
  const toggleBinSelection = useStore((state) => state.toggleBinSelection);
  const openCreateMissionModal = useStore((state) => state.openCreateMissionModal);
  
  const filteredBins = useMemo(() => filterBins(bins, binFilter), [bins, binFilter]);
  
  const handleCreateMission = () => {
    if (selectedBins.size === 0) {
      alert('Seleziona almeno un saldo per creare una missione');
      return;
    }
    openCreateMissionModal();
  };
  
  return (
    <div className="bin-list">
      <div className="bin-list-header">
        <h3>Elenco Saldi ({filteredBins.length})</h3>
        <button
          className="create-mission-btn"
          onClick={handleCreateMission}
          disabled={selectedBins.size === 0}
        >
          Crea Missione da Selezionati ({selectedBins.size})
        </button>
      </div>
      
      <div className="bin-items">
        {filteredBins.length === 0 ? (
          <div className="no-bins">Nessun saldo trovato</div>
        ) : (
          filteredBins.map((bin) => (
            <div
              key={bin.id}
              className={`bin-item ${selectedBins.has(bin.id) ? 'selected' : ''}`}
              onClick={() => toggleBinSelection(bin.id)}
            >
              <div className="bin-checkbox">
                <input
                  type="checkbox"
                  checked={selectedBins.has(bin.id)}
                  onChange={() => {}}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              <div className="bin-details">
                <div className="bin-main-info">
                  <span className="bin-id">{bin.id}</span>
                  <span className="bin-article">
                    {bin.articolo.codice} - {bin.articolo.descrizione}
                  </span>
                  <span className="bin-location">{bin.posizione.cella}</span>
                  <span className="bin-quantity">
                    {bin.quantita} {bin.udm}
                  </span>
                </div>
                
                <div className="bin-meta-info">
                  <span className="bin-meta-item">
                    <strong>Barcode:</strong> {bin.barcode}
                  </span>
                  <span className="bin-meta-item">
                    <strong>RFID:</strong> {bin.rfid_tag}
                  </span>
                  <span className="bin-meta-item">
                    <strong>Magazzino:</strong> {bin.posizione.magazzino}
                  </span>
                  {bin.posizione.zona && (
                    <span className="bin-meta-item">
                      <strong>Zona:</strong> {bin.posizione.zona}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
