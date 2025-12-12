import { create } from 'zustand';
import type { Bin, Mission, BinFilter, MissionFilter, CreateMissionForm } from '../types';
import { mockBins, mockMissions } from '../services/mockData';

interface AppState {
  // Bins
  bins: Bin[];
  selectedBins: Set<string>;
  binFilter: BinFilter;
  
  // Missions
  missions: Mission[];
  missionFilter: MissionFilter;
  
  // UI State
  isCreateMissionModalOpen: boolean;
  
  // Actions
  setBinFilter: (filter: BinFilter) => void;
  setMissionFilter: (filter: MissionFilter) => void;
  toggleBinSelection: (binId: string) => void;
  clearBinSelection: () => void;
  selectAllBins: (binIds: string[]) => void;
  
  openCreateMissionModal: () => void;
  closeCreateMissionModal: () => void;
  
  createMission: (form: CreateMissionForm) => void;
  updateMissionStatus: (missionId: string, status: Mission['stato']) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial State
  bins: mockBins,
  selectedBins: new Set(),
  binFilter: {},
  missions: mockMissions,
  missionFilter: {},
  isCreateMissionModalOpen: false,
  
  // Actions
  setBinFilter: (filter) => set({ binFilter: filter }),
  
  setMissionFilter: (filter) => set({ missionFilter: filter }),
  
  toggleBinSelection: (binId) => set((state) => {
    const newSelected = new Set(state.selectedBins);
    if (newSelected.has(binId)) {
      newSelected.delete(binId);
    } else {
      newSelected.add(binId);
    }
    return { selectedBins: newSelected };
  }),
  
  clearBinSelection: () => set({ selectedBins: new Set() }),
  
  selectAllBins: (binIds) => set({ selectedBins: new Set(binIds) }),
  
  openCreateMissionModal: () => set({ isCreateMissionModalOpen: true }),
  
  closeCreateMissionModal: () => set({ isCreateMissionModalOpen: false }),
  
  createMission: (form) => {
    const newMission: Mission = {
      id: `MISS${String(get().missions.length + 1).padStart(3, '0')}`,
      tipo: form.tipo,
      stato: form.assegnata_a ? 'ASSEGNATA' : 'CREATA',
      bins: form.bins,
      quantita_totale: Object.values(form.quantita).reduce((sum, q) => sum + q, 0),
      origine: form.origine,
      destinazione: form.destinazione,
      assegnata_a: form.assegnata_a || null,
      creata_da: 'manager456', // Would come from auth context
      priorita: form.priorita,
      data_creazione: new Date().toISOString(),
      note: form.note,
    };
    
    set((state) => ({
      missions: [newMission, ...state.missions],
      selectedBins: new Set(),
      isCreateMissionModalOpen: false,
    }));
  },
  
  updateMissionStatus: (missionId, status) => {
    set((state) => ({
      missions: state.missions.map((m) =>
        m.id === missionId ? { ...m, stato: status } : m
      ),
    }));
  },
}));
