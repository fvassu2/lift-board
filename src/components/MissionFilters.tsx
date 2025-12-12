import { useStore } from '../store/useStore';
import type { MissionStatus, MissionType } from '../types';
import './MissionFilters.css';

export const MissionFilters = () => {
  const missionFilter = useStore((state) => state.missionFilter);
  const setMissionFilter = useStore((state) => state.setMissionFilter);
  
  const handleFilterChange = (key: keyof typeof missionFilter, value: string) => {
    setMissionFilter({
      ...missionFilter,
      [key]: value || undefined,
    });
  };
  
  const clearFilters = () => {
    setMissionFilter({});
  };
  
  const hasActiveFilters = Object.values(missionFilter).some((v) => v);
  
  return (
    <div className="mission-filters">
      <div className="mission-filters-header">
        <h4>Filtri Missioni</h4>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Azzera
          </button>
        )}
      </div>
      
      <div className="mission-filters-row">
        <div className="mission-filter-group">
          <label htmlFor="mission-stato">Stato</label>
          <select
            id="mission-stato"
            value={missionFilter.stato || ''}
            onChange={(e) => handleFilterChange('stato', e.target.value as MissionStatus)}
          >
            <option value="">Tutti</option>
            <option value="CREATA">Creata</option>
            <option value="ASSEGNATA">Assegnata</option>
            <option value="IN_CORSO">In Corso</option>
            <option value="COMPLETATA">Completata</option>
            <option value="ANNULLATA">Annullata</option>
          </select>
        </div>
        
        <div className="mission-filter-group">
          <label htmlFor="mission-tipo">Tipo</label>
          <select
            id="mission-tipo"
            value={missionFilter.tipo || ''}
            onChange={(e) => handleFilterChange('tipo', e.target.value as MissionType)}
          >
            <option value="">Tutti</option>
            <option value="IN_ENTRATA">IN ENTRATA</option>
            <option value="IN_USCITA">IN USCITA</option>
          </select>
        </div>
        
        <div className="mission-filter-group">
          <label htmlFor="mission-assegnazione">Assegnazione</label>
          <select
            id="mission-assegnazione"
            value={missionFilter.assegnazione || ''}
            onChange={(e) => handleFilterChange('assegnazione', e.target.value as 'utente' | 'pubblica')}
          >
            <option value="">Tutte</option>
            <option value="pubblica">Pubbliche</option>
            <option value="utente">Assegnate a Utente</option>
          </select>
        </div>
      </div>
    </div>
  );
};
