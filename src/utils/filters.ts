import type { Bin, Mission, BinFilter, MissionFilter } from '../types';

export const filterBins = (bins: Bin[], filter: BinFilter): Bin[] => {
  return bins.filter((bin) => {
    if (filter.magazzino && bin.posizione.magazzino !== filter.magazzino) {
      return false;
    }
    
    if (filter.articolo && bin.articolo.codice !== filter.articolo) {
      return false;
    }
    
    if (filter.zona && bin.posizione.zona !== filter.zona) {
      return false;
    }
    
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      return (
        bin.id.toLowerCase().includes(searchLower) ||
        bin.articolo.codice.toLowerCase().includes(searchLower) ||
        bin.articolo.descrizione.toLowerCase().includes(searchLower) ||
        bin.barcode.includes(searchLower) ||
        bin.rfid_tag.toLowerCase().includes(searchLower) ||
        bin.posizione.cella.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
};

export const filterMissions = (missions: Mission[], filter: MissionFilter): Mission[] => {
  return missions.filter((mission) => {
    if (filter.stato && mission.stato !== filter.stato) {
      return false;
    }
    
    if (filter.tipo && mission.tipo !== filter.tipo) {
      return false;
    }
    
    if (filter.assegnazione) {
      if (filter.assegnazione === 'pubblica' && mission.assegnata_a !== null) {
        return false;
      }
      if (filter.assegnazione === 'utente' && mission.assegnata_a === null) {
        return false;
      }
    }
    
    if (filter.magazzino) {
      const hasWarehouse = 
        mission.origine.magazzino === filter.magazzino ||
        mission.destinazione.magazzino === filter.magazzino;
      if (!hasWarehouse) {
        return false;
      }
    }
    
    return true;
  });
};

export const getUniqueValues = <T extends object>(
  items: T[],
  key: string
): string[] => {
  const values = new Set<string>();
  items.forEach((item) => {
    const value = key.split('.').reduce((obj: unknown, k: string): unknown => {
      return obj && typeof obj === 'object' && k in obj 
        ? (obj as Record<string, unknown>)[k] 
        : undefined;
    }, item as unknown);
    if (value) values.add(String(value));
  });
  return Array.from(values).sort();
};
