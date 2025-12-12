import { useStore } from '../store/useStore';
import { getUniqueValues } from '../utils/filters';
import './BinFilters.css';

export const BinFilters = () => {
  const bins = useStore((state) => state.bins);
  const binFilter = useStore((state) => state.binFilter);
  const setBinFilter = useStore((state) => state.setBinFilter);
  
  const warehouses = getUniqueValues(bins, 'posizione.magazzino');
  const articles = getUniqueValues(bins, 'articolo.codice');
  const zones = getUniqueValues(bins, 'posizione.zona');
  
  const handleFilterChange = (key: keyof typeof binFilter, value: string) => {
    setBinFilter({
      ...binFilter,
      [key]: value || undefined,
    });
  };
  
  const clearFilters = () => {
    setBinFilter({});
  };
  
  const hasActiveFilters = Object.values(binFilter).some((v) => v);
  
  return (
    <div className="bin-filters">
      <div className="filters-header">
        <h3>Filtri Saldi</h3>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Azzera Filtri
          </button>
        )}
      </div>
      
      <div className="filter-group">
        <label htmlFor="search">Ricerca</label>
        <input
          id="search"
          type="text"
          placeholder="Cerca per ID, articolo, barcode..."
          value={binFilter.searchText || ''}
          onChange={(e) => handleFilterChange('searchText', e.target.value)}
        />
      </div>
      
      <div className="filter-group">
        <label htmlFor="magazzino">Magazzino</label>
        <select
          id="magazzino"
          value={binFilter.magazzino || ''}
          onChange={(e) => handleFilterChange('magazzino', e.target.value)}
        >
          <option value="">Tutti</option>
          {warehouses.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="articolo">Articolo</label>
        <select
          id="articolo"
          value={binFilter.articolo || ''}
          onChange={(e) => handleFilterChange('articolo', e.target.value)}
        >
          <option value="">Tutti</option>
          {articles.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="zona">Zona</label>
        <select
          id="zona"
          value={binFilter.zona || ''}
          onChange={(e) => handleFilterChange('zona', e.target.value)}
        >
          <option value="">Tutte</option>
          {zones.map((z) => (
            <option key={z} value={z}>Zona {z}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
