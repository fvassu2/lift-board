import type { Bin, Mission, Warehouse, WarehouseCell } from '../types';

// Mock warehouse cells
const createWarehouseCells = (): WarehouseCell[] => {
  const cells: WarehouseCell[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const columns = 12;
  const levels = 4;

  rows.forEach((row, rowIndex) => {
    for (let col = 1; col <= columns; col++) {
      for (let level = 1; level <= levels; level++) {
        const id = `${row}-${col.toString().padStart(2, '0')}-${level.toString().padStart(2, '0')}`;
        cells.push({
          id,
          posizione: id,
          x: col * 60,
          y: rowIndex * 80,
          bins: [],
          occupato: Math.random() > 0.6,
        });
      }
    }
  });

  return cells;
};

export const mockWarehouses: Warehouse[] = [
  {
    id: 'MAG001',
    nome: 'Magazzino Principale',
    zone: ['A', 'B', 'C', 'D', 'E'],
    celle: createWarehouseCells(),
    width: 800,
    height: 500,
  },
];

export const mockBins: Bin[] = [
  {
    id: 'BIN001',
    articolo: {
      codice: 'ART123',
      descrizione: 'Pere Conference',
      foto_url: '/images/pere.jpg',
    },
    barcode: '7891234567890',
    rfid_tag: 'E200001234567890',
    posizione: {
      magazzino: 'MAG001',
      cella: 'A-12-03',
      zona: 'A',
    },
    quantita: 50,
    udm: 'KG',
  },
  {
    id: 'BIN002',
    articolo: {
      codice: 'ART123',
      descrizione: 'Pere Conference',
      foto_url: '/images/pere.jpg',
    },
    barcode: '7891234567891',
    rfid_tag: 'E200001234567891',
    posizione: {
      magazzino: 'MAG001',
      cella: 'A-12-04',
      zona: 'A',
    },
    quantita: 30,
    udm: 'KG',
  },
  {
    id: 'BIN003',
    articolo: {
      codice: 'ART456',
      descrizione: 'Mele Gala',
      foto_url: '/images/mele.jpg',
    },
    barcode: '7891234567892',
    rfid_tag: 'E200001234567892',
    posizione: {
      magazzino: 'MAG001',
      cella: 'B-05-01',
      zona: 'B',
    },
    quantita: 45,
    udm: 'KG',
  },
  {
    id: 'BIN004',
    articolo: {
      codice: 'ART789',
      descrizione: 'Arance Tarocco',
      foto_url: '/images/arance.jpg',
    },
    barcode: '7891234567893',
    rfid_tag: 'E200001234567893',
    posizione: {
      magazzino: 'MAG001',
      cella: 'C-08-02',
      zona: 'C',
    },
    quantita: 60,
    udm: 'KG',
  },
  {
    id: 'BIN005',
    articolo: {
      codice: 'ART101',
      descrizione: 'Limoni di Sicilia',
      foto_url: '/images/limoni.jpg',
    },
    barcode: '7891234567894',
    rfid_tag: 'E200001234567894',
    posizione: {
      magazzino: 'MAG001',
      cella: 'D-03-01',
      zona: 'D',
    },
    quantita: 25,
    udm: 'KG',
  },
  {
    id: 'BIN006',
    articolo: {
      codice: 'ART202',
      descrizione: 'Banane',
      foto_url: '/images/banane.jpg',
    },
    barcode: '7891234567895',
    rfid_tag: 'E200001234567895',
    posizione: {
      magazzino: 'MAG001',
      cella: 'E-10-03',
      zona: 'E',
    },
    quantita: 80,
    udm: 'KG',
  },
];

export const mockMissions: Mission[] = [
  {
    id: 'MISS001',
    tipo: 'IN_ENTRATA',
    stato: 'CREATA',
    bins: ['BIN001', 'BIN002'],
    quantita_totale: 80,
    origine: {
      tipo: 'PIAZZALE',
      riferimento: 'PIAZ-01',
    },
    destinazione: {
      tipo: 'CELLA',
      magazzino: 'MAG001',
      riferimento: 'A-12-03',
    },
    assegnata_a: null,
    creata_da: 'manager456',
    priorita: 1,
    data_creazione: new Date(Date.now() - 3600000).toISOString(),
    note: 'Urgente per produzione',
  },
  {
    id: 'MISS002',
    tipo: 'IN_USCITA',
    stato: 'IN_CORSO',
    bins: ['BIN003'],
    quantita_totale: 45,
    origine: {
      tipo: 'CELLA',
      magazzino: 'MAG001',
      riferimento: 'B-05-01',
    },
    destinazione: {
      tipo: 'LINEA_PRODUZIONE',
      riferimento: 'LINEA-003',
    },
    assegnata_a: 'operatore1',
    creata_da: 'manager456',
    priorita: 2,
    data_creazione: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'MISS003',
    tipo: 'IN_ENTRATA',
    stato: 'COMPLETATA',
    bins: ['BIN004'],
    quantita_totale: 60,
    origine: {
      tipo: 'PIAZZALE',
      riferimento: 'PIAZ-02',
    },
    destinazione: {
      tipo: 'CELLA',
      magazzino: 'MAG001',
      riferimento: 'C-08-02',
    },
    assegnata_a: 'operatore2',
    creata_da: 'manager456',
    priorita: 3,
    data_creazione: new Date(Date.now() - 86400000).toISOString(),
  },
];
