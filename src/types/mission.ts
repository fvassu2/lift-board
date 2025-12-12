export type MissionType = 'IN_ENTRATA' | 'IN_USCITA';

export type MissionPriority = 'ALTA' | 'MEDIA' | 'BASSA';

export type MissionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type BinStatus = 'PENDING' | 'IN_CARICAMENTO' | 'CARICATO' | 'SCARICATO';

export interface Article {
  code: string;
  description: string;
  photoUrl?: string;
}

export interface Bin {
  id: string;
  articleCode: string;
  quantity: number;
  weight: number;
  status: BinStatus;
}

export interface Location {
  code: string;
  name: string;
  type: 'PIAZZALE' | 'CELLA' | 'LINEA_PRODUZIONE';
}

export interface Mission {
  id: string;
  code: string;
  type: MissionType;
  status: MissionStatus;
  priority: MissionPriority;
  article: Article;
  bins: Bin[];
  origin: Location;
  destination: Location;
  assignedTo?: string;
  startTime?: string;
  estimatedDuration?: number;
  totalWeight: number;
  totalBins: number;
  completedBins: number;
}

export interface Operator {
  id: string;
  name: string;
  shift: string;
}
