import type { Mission, Operator } from '../types';

export const mockOperator: Operator = {
  id: 'OP001',
  name: 'Marco Rossi',
  deviceId: 'DEVICE_01',
};

export const mockMyMissions: Mission[] = [
  {
    id: 'MISS123',
    type: 'IN',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    article: {
      code: 'ART001',
      description: 'Pere Conference',
      imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop',
    },
    from: {
      id: 'LOC001',
      name: 'Piazzale-02',
      type: 'zone',
    },
    to: {
      id: 'LOC002',
      name: 'A-12-05',
      type: 'warehouse',
    },
    binsTotal: 10,
    binsCompleted: 5,
    quantityKg: 50,
    assignedTo: 'OP001',
    createdAt: '2025-12-12T09:30:00Z',
    startedAt: '2025-12-12T10:00:00Z',
  },
  {
    id: 'MISS124',
    type: 'OUT',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    article: {
      code: 'ART002',
      description: 'Mele Golden',
      imageUrl: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=400&fit=crop',
    },
    from: {
      id: 'LOC003',
      name: 'B-03-04',
      type: 'warehouse',
    },
    to: {
      id: 'LOC004',
      name: 'Linea-01',
      type: 'line',
    },
    binsTotal: 8,
    binsCompleted: 0,
    quantityKg: 30,
    assignedTo: 'OP001',
    createdAt: '2025-12-12T09:45:00Z',
  },
  {
    id: 'MISS125',
    type: 'IN',
    priority: 'LOW',
    status: 'ASSIGNED',
    article: {
      code: 'ART003',
      description: 'Arance Tarocco',
      imageUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop',
    },
    from: {
      id: 'LOC005',
      name: 'Piazzale-03',
      type: 'zone',
    },
    to: {
      id: 'LOC006',
      name: 'C-05-12',
      type: 'warehouse',
    },
    binsTotal: 6,
    binsCompleted: 0,
    quantityKg: 25,
    assignedTo: 'OP001',
    createdAt: '2025-12-12T10:00:00Z',
  },
];

export const mockPublicMissions: Mission[] = [
  {
    id: 'MISS126',
    type: 'OUT',
    priority: 'HIGH',
    status: 'UNASSIGNED',
    article: {
      code: 'ART004',
      description: 'Limoni Sicilia',
      imageUrl: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop',
    },
    from: {
      id: 'LOC007',
      name: 'A-08-15',
      type: 'warehouse',
    },
    to: {
      id: 'LOC008',
      name: 'Linea-02',
      type: 'line',
    },
    binsTotal: 12,
    binsCompleted: 0,
    quantityKg: 60,
    createdAt: '2025-12-12T10:15:00Z',
  },
  {
    id: 'MISS127',
    type: 'IN',
    priority: 'MEDIUM',
    status: 'UNASSIGNED',
    article: {
      code: 'ART005',
      description: 'Kiwi Hayward',
      imageUrl: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&h=400&fit=crop',
    },
    from: {
      id: 'LOC009',
      name: 'Piazzale-01',
      type: 'zone',
    },
    to: {
      id: 'LOC010',
      name: 'D-02-08',
      type: 'warehouse',
    },
    binsTotal: 15,
    binsCompleted: 0,
    quantityKg: 45,
    createdAt: '2025-12-12T10:20:00Z',
  },
];
