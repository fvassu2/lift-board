import { useState, useEffect } from 'react';
import type { Mission } from '../../types/mission';
import './MissionsDrawer.css';

interface MissionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMission: (mission: Mission) => void;
}

const MissionsDrawer = ({ isOpen, onClose, onSelectMission }: MissionsDrawerProps) => {
  const [assignedMissions, setAssignedMissions] = useState<Mission[]>([]);
  const [publicMissions, setPublicMissions] = useState<Mission[]>([]);
  const [filter, setFilter] = useState({ type: '', priority: '' });

  useEffect(() => {
    // Mock data - in real app this would fetch from API
    const mockAssignedMissions: Mission[] = [
      {
        id: 'MISS002',
        code: 'MISS002',
        type: 'IN_ENTRATA',
        status: 'PENDING',
        priority: 'ALTA',
        article: {
          code: 'ART456',
          description: 'Mele Gala',
          photoUrl: ''
        },
        bins: [],
        origin: { code: 'B-12', name: 'Cella B-12', type: 'CELLA' },
        destination: { code: 'LINEA-03', name: 'Linea Produzione 03', type: 'LINEA_PRODUZIONE' },
        totalWeight: 1200,
        totalBins: 30,
        completedBins: 0,
        estimatedDuration: 25
      }
    ];

    const mockPublicMissions: Mission[] = [
      {
        id: 'MISS007',
        code: 'MISS007',
        type: 'IN_USCITA',
        status: 'PENDING',
        priority: 'ALTA',
        article: {
          code: 'ART789',
          description: 'Carote',
          photoUrl: ''
        },
        bins: [],
        origin: { code: 'C-08', name: 'Cella C-08', type: 'CELLA' },
        destination: { code: 'LINEA-01', name: 'Linea Produzione 01', type: 'LINEA_PRODUZIONE' },
        totalWeight: 800,
        totalBins: 20,
        completedBins: 0,
        estimatedDuration: 15
      }
    ];

    setAssignedMissions(mockAssignedMissions);
    setPublicMissions(mockPublicMissions);
  }, []);

  const handleSelectMission = (mission: Mission) => {
    onSelectMission(mission);
    onClose();
  };

  const handleAssignMission = (mission: Mission) => {
    // Move from public to assigned
    setPublicMissions(prev => prev.filter(m => m.id !== mission.id));
    setAssignedMissions(prev => [...prev, mission]);
    alert(`Missione ${mission.code} assegnata!`);
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      ALTA: '#F44336',
      MEDIA: '#FF9800',
      BASSA: '#4CAF50'
    };
    return colors[priority as keyof typeof colors] || '#9E9E9E';
  };

  return (
    <>
      {isOpen && <div className="drawer-overlay" onClick={onClose} />}
      <div className={`missions-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button className="back-button" onClick={onClose}>← Missioni Disponibili</button>
        </div>

        <div className="drawer-filters">
          <select 
            value={filter.type} 
            onChange={(e) => setFilter({...filter, type: e.target.value})}
            className="filter-select"
          >
            <option value="">Tutti i tipi</option>
            <option value="IN_ENTRATA">In Entrata</option>
            <option value="IN_USCITA">In Uscita</option>
          </select>
          <select 
            value={filter.priority} 
            onChange={(e) => setFilter({...filter, priority: e.target.value})}
            className="filter-select"
          >
            <option value="">Tutte le priorità</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BASSA">Bassa</option>
          </select>
        </div>

        <div className="drawer-content">
          {/* Assigned Missions */}
          <section className="missions-section">
            <h3>📋 ASSEGNATE A TE</h3>
            <div className="missions-list">
              {assignedMissions.length === 0 ? (
                <div className="no-missions">Nessuna missione assegnata</div>
              ) : (
                assignedMissions.map(mission => (
                  <div key={mission.id} className="mission-item">
                    <div className="mission-item-header">
                      <span className="mission-code">● {mission.code}</span>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityBadge(mission.priority) }}
                      >
                        {mission.priority}
                      </span>
                    </div>
                    <div className="mission-item-body">
                      <div className="mission-article">{mission.article.description}</div>
                      <div className="mission-route">
                        {mission.origin.code} → {mission.destination.code}
                      </div>
                      <div className="mission-meta">
                        ⏱ ~{mission.estimatedDuration} min
                      </div>
                    </div>
                    <button 
                      className="btn-select"
                      onClick={() => handleSelectMission(mission)}
                    >
                      Seleziona
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Public Missions */}
          <section className="missions-section">
            <h3>🌐 PUBBLICHE</h3>
            <div className="missions-list">
              {publicMissions.length === 0 ? (
                <div className="no-missions">Nessuna missione pubblica disponibile</div>
              ) : (
                publicMissions.map(mission => (
                  <div key={mission.id} className="mission-item">
                    <div className="mission-item-header">
                      <span className="mission-code">○ {mission.code}</span>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityBadge(mission.priority) }}
                      >
                        {mission.priority}
                      </span>
                    </div>
                    <div className="mission-item-body">
                      <div className="mission-article">{mission.article.description}</div>
                      <div className="mission-route">
                        {mission.origin.code} → {mission.destination.code}
                      </div>
                      <div className="mission-meta">
                        ⏱ ~{mission.estimatedDuration} min
                      </div>
                    </div>
                    <button 
                      className="btn-assign"
                      onClick={() => handleAssignMission(mission)}
                    >
                      Assegnami
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default MissionsDrawer;
