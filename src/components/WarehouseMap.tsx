import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { mockWarehouses } from '../services/mockData';
import './WarehouseMap.css';

export const WarehouseMap = () => {
  const bins = useStore((state) => state.bins);
  
  const warehouse = mockWarehouses[0];
  
  // Create a map of cell positions to bins
  const cellBinMap = useMemo(() => {
    const map = new Map<string, number>();
    bins.forEach((bin) => {
      const count = map.get(bin.posizione.cella) || 0;
      map.set(bin.posizione.cella, count + 1);
    });
    return map;
  }, [bins]);
  
  // Group cells by zone (first letter)
  const cellsByZone = useMemo(() => {
    const zones = new Map<string, typeof warehouse.celle>();
    warehouse.celle.forEach((cell) => {
      const zone = cell.posizione[0];
      if (!zones.has(zone)) {
        zones.set(zone, []);
      }
      zones.get(zone)!.push(cell);
    });
    return zones;
  }, [warehouse]);
  
  return (
    <div className="warehouse-map">
      <h3>Mappa Magazzino: {warehouse.nome}</h3>
      <div className="warehouse-grid">
        {Array.from(cellsByZone.entries()).map(([zone, cells]) => (
          <div key={zone} className="warehouse-zone">
            <div className="zone-label">Zona {zone}</div>
            <div className="zone-cells">
              {cells.slice(0, 20).map((cell) => {
                const binCount = cellBinMap.get(cell.posizione) || 0;
                return (
                  <div
                    key={cell.id}
                    className={`warehouse-cell ${binCount > 0 ? 'occupied' : 'empty'}`}
                    title={`${cell.posizione} - ${binCount} bin${binCount !== 1 ? 's' : ''}`}
                  >
                    <span className="cell-label">{cell.posizione.split('-').slice(1).join('-')}</span>
                    {binCount > 0 && (
                      <span className="bin-count">{binCount}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color occupied"></div>
          <span>Con saldi</span>
        </div>
        <div className="legend-item">
          <div className="legend-color empty"></div>
          <span>Vuoto</span>
        </div>
      </div>
    </div>
  );
};
