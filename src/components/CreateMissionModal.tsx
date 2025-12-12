import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import type { MissionType, LocationType } from '../types';
import './CreateMissionModal.css';

export const CreateMissionModal = () => {
  const isOpen = useStore((state) => state.isCreateMissionModalOpen);
  const closeModal = useStore((state) => state.closeCreateMissionModal);
  const createMission = useStore((state) => state.createMission);
  const selectedBins = useStore((state) => state.selectedBins);
  const bins = useStore((state) => state.bins);
  
  const [tipo, setTipo] = useState<MissionType>('IN_ENTRATA');
  const [origineType, setOrigineType] = useState<LocationType>('PIAZZALE');
  const [origineRef, setOrigineRef] = useState('');
  const [destinazioneType, setDestinazioneType] = useState<LocationType>('CELLA');
  const [destinazioneRef, setDestinazioneRef] = useState('');
  const [destinazioneMagazzino, setDestinazioneMagazzino] = useState('MAG001');
  const [priorita, setPriorita] = useState(1);
  const [note, setNote] = useState('');
  const [assegnataA, setAssegnataA] = useState('');
  
  const selectedBinsList = useMemo(() => {
    return bins.filter((bin) => selectedBins.has(bin.id));
  }, [bins, selectedBins]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origineRef || !destinazioneRef) {
      alert('Compila tutti i campi obbligatori');
      return;
    }
    
    const quantita: Record<string, number> = {};
    selectedBinsList.forEach((bin) => {
      quantita[bin.id] = bin.quantita;
    });
    
    createMission({
      tipo,
      bins: Array.from(selectedBins),
      quantita,
      origine: {
        tipo: origineType,
        riferimento: origineRef,
      },
      destinazione: {
        tipo: destinazioneType,
        riferimento: destinazioneRef,
        magazzino: destinazioneType === 'CELLA' ? destinazioneMagazzino : undefined,
      },
      priorita,
      note: note || undefined,
      assegnata_a: assegnataA || null,
    });
    
    // Reset form
    setOrigineRef('');
    setDestinazioneRef('');
    setNote('');
    setAssegnataA('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crea Nuova Missione</h2>
          <button className="close-btn" onClick={closeModal}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Bins Selezionati ({selectedBinsList.length})</h3>
            <div className="selected-bins-preview">
              {selectedBinsList.map((bin) => (
                <div key={bin.id} className="preview-bin">
                  <strong>{bin.id}</strong> - {bin.articolo.descrizione} ({bin.quantita} {bin.udm})
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-section">
            <h3>Dettagli Missione</h3>
            
            <div className="form-group">
              <label htmlFor="tipo">Tipo Missione *</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value as MissionType);
                  if (e.target.value === 'IN_ENTRATA') {
                    setOrigineType('PIAZZALE');
                    setDestinazioneType('CELLA');
                  } else {
                    setOrigineType('CELLA');
                    setDestinazioneType('LINEA_PRODUZIONE');
                  }
                }}
              >
                <option value="IN_ENTRATA">IN ENTRATA (da piazzale a magazzino)</option>
                <option value="IN_USCITA">IN USCITA (da magazzino a produzione)</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="origineType">Tipo Origine</label>
                <select
                  id="origineType"
                  value={origineType}
                  onChange={(e) => setOrigineType(e.target.value as LocationType)}
                >
                  <option value="PIAZZALE">Piazzale</option>
                  <option value="CELLA">Cella</option>
                  <option value="LINEA_PRODUZIONE">Linea Produzione</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="origineRef">Origine *</label>
                <input
                  id="origineRef"
                  type="text"
                  value={origineRef}
                  onChange={(e) => setOrigineRef(e.target.value)}
                  placeholder={origineType === 'PIAZZALE' ? 'es. PIAZ-01' : 'es. A-12-03'}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="destinazioneType">Tipo Destinazione</label>
                <select
                  id="destinazioneType"
                  value={destinazioneType}
                  onChange={(e) => setDestinazioneType(e.target.value as LocationType)}
                >
                  <option value="PIAZZALE">Piazzale</option>
                  <option value="CELLA">Cella</option>
                  <option value="LINEA_PRODUZIONE">Linea Produzione</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="destinazioneRef">Destinazione *</label>
                <input
                  id="destinazioneRef"
                  type="text"
                  value={destinazioneRef}
                  onChange={(e) => setDestinazioneRef(e.target.value)}
                  placeholder={destinazioneType === 'CELLA' ? 'es. B-05-12' : 'es. LINEA-003'}
                  required
                />
              </div>
            </div>
            
            {destinazioneType === 'CELLA' && (
              <div className="form-group">
                <label htmlFor="destinazioneMagazzino">Magazzino Destinazione</label>
                <input
                  id="destinazioneMagazzino"
                  type="text"
                  value={destinazioneMagazzino}
                  onChange={(e) => setDestinazioneMagazzino(e.target.value)}
                />
              </div>
            )}
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priorita">Priorità</label>
                <input
                  id="priorita"
                  type="number"
                  min="1"
                  max="5"
                  value={priorita}
                  onChange={(e) => setPriorita(Number(e.target.value))}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="assegnataA">Assegnata a (vuoto = pubblica)</label>
                <input
                  id="assegnataA"
                  type="text"
                  value={assegnataA}
                  onChange={(e) => setAssegnataA(e.target.value)}
                  placeholder="es. operatore1"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="note">Note</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Note aggiuntive..."
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Annulla
            </button>
            <button type="submit" className="btn-primary">
              Crea Missione
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
