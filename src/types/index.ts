// Type definitions for the Mission Manager Dashboard

export interface Article {
  codice: string;
  descrizione: string;
  foto_url?: string;
}

export interface Position {
  magazzino: string;
  cella: string;
  zona?: string;
}

export interface Bin {
  id: string;
  articolo: Article;
  barcode: string;
  rfid_tag: string;
  posizione: Position;
  quantita: number;
  udm: string;
}

export type MissionType = 'IN_ENTRATA' | 'IN_USCITA';
export type MissionStatus = 'CREATA' | 'ASSEGNATA' | 'IN_CORSO' | 'COMPLETATA' | 'ANNULLATA';
export type LocationType = 'PIAZZALE' | 'CELLA' | 'LINEA_PRODUZIONE';

export interface MissionLocation {
  tipo: LocationType;
  riferimento: string;
  magazzino?: string;
}

export interface Mission {
  id: string;
  tipo: MissionType;
  stato: MissionStatus;
  bins: string[];
  quantita_totale: number;
  origine: MissionLocation;
  destinazione: MissionLocation;
  assegnata_a: string | null;
  creata_da: string;
  priorita: number;
  data_creazione: string;
  note?: string;
}

export interface WarehouseCell {
  id: string;
  posizione: string;
  x: number;
  y: number;
  bins: string[];
  occupato: boolean;
}

export interface Warehouse {
  id: string;
  nome: string;
  zone: string[];
  celle: WarehouseCell[];
  width: number;
  height: number;
}

export interface BinFilter {
  magazzino?: string;
  articolo?: string;
  zona?: string;
  searchText?: string;
}

export interface MissionFilter {
  stato?: MissionStatus;
  tipo?: MissionType;
  assegnazione?: 'utente' | 'pubblica';
  dataCreazione?: string;
  magazzino?: string;
}

export interface CreateMissionForm {
  tipo: MissionType;
  bins: string[];
  quantita: Record<string, number>;
  origine: MissionLocation;
  destinazione: MissionLocation;
  priorita: number;
  note?: string;
  assegnata_a?: string | null;
}
