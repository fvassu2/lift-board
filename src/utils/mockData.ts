import type { Mission } from '../types';
import { MissionType, MissionPriority, MissionStatus } from '../types';

export const mockMissions: Mission[] = [
  {
    id: 'MISS001',
    code: 'MISS001',
    type: MissionType.IN_ENTRATA,
    status: MissionStatus.IN_PROGRESS,
    priority: MissionPriority.HIGH,
    article: {
      code: 'ART123',
      description: 'Pere Conference',
      photoUrl: 'https://images.unsplash.com/photo-1568031813264-d394c5d474b9?w=400&h=300&fit=crop'
    },
    bins: [
      { id: 'BIN001', code: 'BIN001', quantity: 500, status: 'UNLOADED', rfidTag: 'RFID001' },
      { id: 'BIN002', code: 'BIN002', quantity: 500, status: 'UNLOADED', rfidTag: 'RFID002' },
      { id: 'BIN003', code: 'BIN003', quantity: 500, status: 'LOADED', rfidTag: 'RFID003' },
      { id: 'BIN004', code: 'BIN004', quantity: 500, status: 'PENDING', rfidTag: 'RFID004' },
      { id: 'BIN005', code: 'BIN005', quantity: 500, status: 'PENDING', rfidTag: 'RFID005' },
    ],
    origin: {
      id: 'PIAZ-01',
      name: 'Piazzale PIAZ-01',
      type: 'YARD'
    },
    destination: {
      id: 'A-12-03',
      name: 'Cella A-12-03',
      type: 'CELL',
      warehouse: 'MAG001'
    },
    assignedOperator: 'OP001',
    estimatedTime: 30,
    startTime: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    progress: {
      completed: 3,
      total: 5
    }
  },
  {
    id: 'MISS002',
    code: 'MISS002',
    type: MissionType.IN_USCITA,
    status: MissionStatus.PENDING,
    priority: MissionPriority.HIGH,
    article: {
      code: 'ART456',
      description: 'Mele Gala',
      photoUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400&h=300&fit=crop'
    },
    bins: [
      { id: 'BIN006', code: 'BIN006', quantity: 300, status: 'PENDING' },
      { id: 'BIN007', code: 'BIN007', quantity: 300, status: 'PENDING' },
      { id: 'BIN008', code: 'BIN008', quantity: 300, status: 'PENDING' },
    ],
    origin: {
      id: 'B-12',
      name: 'Cella B-12',
      type: 'CELL',
      warehouse: 'MAG001'
    },
    destination: {
      id: 'LINEA-03',
      name: 'Linea Produzione 03',
      type: 'PRODUCTION_LINE'
    },
    assignedOperator: 'OP001',
    estimatedTime: 20,
    progress: {
      completed: 0,
      total: 3
    }
  },
  {
    id: 'MISS005',
    code: 'MISS005',
    type: MissionType.IN_ENTRATA,
    status: MissionStatus.PENDING,
    priority: MissionPriority.MEDIUM,
    article: {
      code: 'ART789',
      description: 'Patate',
      photoUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop'
    },
    bins: [
      { id: 'BIN009', code: 'BIN009', quantity: 400, status: 'PENDING' },
      { id: 'BIN010', code: 'BIN010', quantity: 400, status: 'PENDING' },
    ],
    origin: {
      id: 'PIAZ-02',
      name: 'Piazzale PIAZ-02',
      type: 'YARD'
    },
    destination: {
      id: 'A-15',
      name: 'Cella A-15',
      type: 'CELL',
      warehouse: 'MAG001'
    },
    assignedOperator: 'OP001',
    estimatedTime: 15,
    progress: {
      completed: 0,
      total: 2
    }
  },
  {
    id: 'MISS007',
    code: 'MISS007',
    type: MissionType.IN_ENTRATA,
    status: MissionStatus.PENDING,
    priority: MissionPriority.HIGH,
    article: {
      code: 'ART321',
      description: 'Carote',
      photoUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop'
    },
    bins: [
      { id: 'BIN011', code: 'BIN011', quantity: 250, status: 'PENDING' },
      { id: 'BIN012', code: 'BIN012', quantity: 250, status: 'PENDING' },
      { id: 'BIN013', code: 'BIN013', quantity: 250, status: 'PENDING' },
      { id: 'BIN014', code: 'BIN014', quantity: 250, status: 'PENDING' },
    ],
    origin: {
      id: 'C-08',
      name: 'Cella C-08',
      type: 'CELL',
      warehouse: 'MAG002'
    },
    destination: {
      id: 'LINEA-01',
      name: 'Linea Produzione 01',
      type: 'PRODUCTION_LINE'
    },
    estimatedTime: 25,
    progress: {
      completed: 0,
      total: 4
    }
  },
  {
    id: 'MISS009',
    code: 'MISS009',
    type: MissionType.IN_USCITA,
    status: MissionStatus.PENDING,
    priority: MissionPriority.LOW,
    article: {
      code: 'ART654',
      description: 'Cipolle',
      photoUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784226?w=400&h=300&fit=crop'
    },
    bins: [
      { id: 'BIN015', code: 'BIN015', quantity: 350, status: 'PENDING' },
      { id: 'BIN016', code: 'BIN016', quantity: 350, status: 'PENDING' },
    ],
    origin: {
      id: 'PIAZ-03',
      name: 'Piazzale PIAZ-03',
      type: 'YARD'
    },
    destination: {
      id: 'D-20',
      name: 'Cella D-20',
      type: 'CELL',
      warehouse: 'MAG003'
    },
    estimatedTime: 18,
    progress: {
      completed: 0,
      total: 2
    }
  }
];
