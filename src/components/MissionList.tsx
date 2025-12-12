import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { filterMissions } from '../utils/filters';
import { formatDistance } from 'date-fns';
import { it } from 'date-fns/locale';
import type { MissionStatus } from '../types';
import './MissionList.css';

const statusLabels: Record<string, string> = {
  CREATA: 'Creata',
  ASSEGNATA: 'Assegnata',
  IN_CORSO: 'In Corso',
  COMPLETATA: 'Completata',
  ANNULLATA: 'Annullata',
};

const statusColors: Record<string, string> = {
  CREATA: '#2196f3',
  ASSEGNATA: '#ff9800',
  IN_CORSO: '#9c27b0',
  COMPLETATA: '#4caf50',
  ANNULLATA: '#f44336',
};

const tipoLabels: Record<string, string> = {
  IN_ENTRATA: 'IN ENTRATA',
  IN_USCITA: 'IN USCITA',
};

export const MissionList = () => {
  const missions = useStore((state) => state.missions);
  const missionFilter = useStore((state) => state.missionFilter);
  const updateMissionStatus = useStore((state) => state.updateMissionStatus);
  
  const filteredMissions = useMemo(
    () => filterMissions(missions, missionFilter),
    [missions, missionFilter]
  );
  
  const handleStatusChange = (missionId: string, newStatus: MissionStatus) => {
    updateMissionStatus(missionId, newStatus);
  };
  
  return (
    <div className="mission-list">
      <h3>Missioni Esistenti ({filteredMissions.length})</h3>
      
      <div className="mission-items">
        {filteredMissions.length === 0 ? (
          <div className="no-missions">Nessuna missione trovata</div>
        ) : (
          filteredMissions.map((mission) => (
            <div key={mission.id} className="mission-card">
              <div className="mission-header">
                <span className="mission-id">{mission.id}</span>
                <span
                  className="mission-status"
                  style={{ backgroundColor: statusColors[mission.stato] }}
                >
                  {statusLabels[mission.stato]}
                </span>
                <span className="mission-type">{tipoLabels[mission.tipo]}</span>
              </div>
              
              <div className="mission-body">
                <div className="mission-route">
                  <div className="route-point">
                    <strong>Da:</strong>{' '}
                    {mission.origine.tipo === 'PIAZZALE' ? '🚚 ' : '📦 '}
                    {mission.origine.riferimento}
                  </div>
                  <div className="route-arrow">→</div>
                  <div className="route-point">
                    <strong>A:</strong>{' '}
                    {mission.destinazione.tipo === 'CELLA' ? '📦 ' : '🏭 '}
                    {mission.destinazione.riferimento}
                    {mission.destinazione.magazzino && ` (${mission.destinazione.magazzino})`}
                  </div>
                </div>
                
                <div className="mission-details">
                  <span className="detail-item">
                    <strong>Bins:</strong> {mission.bins.length}
                  </span>
                  <span className="detail-item">
                    <strong>Quantità:</strong> {mission.quantita_totale} KG
                  </span>
                  <span className="detail-item">
                    <strong>Priorità:</strong> {mission.priorita}
                  </span>
                  <span className="detail-item">
                    <strong>Assegnata a:</strong>{' '}
                    {mission.assegnata_a || '👥 Pubblica'}
                  </span>
                </div>
                
                {mission.note && (
                  <div className="mission-notes">
                    <strong>Note:</strong> {mission.note}
                  </div>
                )}
                
                <div className="mission-footer">
                  <span className="mission-time">
                    Creata {formatDistance(new Date(mission.data_creazione), new Date(), { 
                      addSuffix: true,
                      locale: it 
                    })}
                  </span>
                  
                  {mission.stato !== 'COMPLETATA' && mission.stato !== 'ANNULLATA' && (
                    <div className="mission-actions">
                      {mission.stato === 'CREATA' && (
                        <button
                          className="action-btn"
                          onClick={() => handleStatusChange(mission.id, 'ASSEGNATA')}
                        >
                          Assegna
                        </button>
                      )}
                      {mission.stato === 'ASSEGNATA' && (
                        <button
                          className="action-btn"
                          onClick={() => handleStatusChange(mission.id, 'IN_CORSO')}
                        >
                          Avvia
                        </button>
                      )}
                      {mission.stato === 'IN_CORSO' && (
                        <button
                          className="action-btn success"
                          onClick={() => handleStatusChange(mission.id, 'COMPLETATA')}
                        >
                          Completa
                        </button>
                      )}
                      <button
                        className="action-btn danger"
                        onClick={() => handleStatusChange(mission.id, 'ANNULLATA')}
                      >
                        Annulla
                      </button>
                    </div>
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
