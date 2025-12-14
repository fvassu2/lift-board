import { create } from 'zustand';
import type {
  Mission,
  RFIDConnection,
  RFIDMessage,
  Notification,
  Operator,
} from '../types';
import {
  AnimationState,
  RFIDStatus,
  MissionStatus,
} from '../types';

interface AppState {
  // Operator
  operator: Operator | null;
  setOperator: (operator: Operator) => void;

  // Missions
  currentMission: Mission | null;
  assignedMissions: Mission[];
  publicMissions: Mission[];
  setCurrentMission: (mission: Mission | null) => void;
  setAssignedMissions: (missions: Mission[]) => void;
  setPublicMissions: (missions: Mission[]) => void;
  startMission: (missionId: string) => void;
  completeBin: (binId: string) => void;
  completeMission: () => void;
  assignMission: (missionId: string) => void;

  // RFID
  rfidConnection: RFIDConnection;
  rfidMessages: RFIDMessage[];
  setRFIDConnection: (connection: RFIDConnection) => void;
  addRFIDMessage: (message: RFIDMessage) => void;
  clearRFIDMessages: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;

  // Animation
  animationState: AnimationState;
  setAnimationState: (state: AnimationState) => void;

  // UI State
  isMissionDrawerOpen: boolean;
  toggleMissionDrawer: () => void;
  isManualMode: boolean;
  setManualMode: (mode: boolean) => void;
  manualOperationsCount: number;
  rfidOperationsCount: number;
  incrementManualOperations: () => void;
  incrementRFIDOperations: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Operator
  operator: {
    id: 'OP001',
    name: 'Mario Rossi',
    shift: 'Mattina',
    startTime: new Date().toISOString(),
  },
  setOperator: (operator) => set({ operator }),

  // Missions
  currentMission: null,
  assignedMissions: [],
  publicMissions: [],
  
  setCurrentMission: (mission) => {
    set({ currentMission: mission });
    if (mission?.status === MissionStatus.IN_PROGRESS) {
      set({ animationState: AnimationState.MOVING_TO_ORIGIN });
    }
  },
  
  setAssignedMissions: (missions) => set({ assignedMissions: missions }),
  setPublicMissions: (missions) => set({ publicMissions: missions }),
  
  startMission: (missionId) => {
    const mission = get().assignedMissions.find(m => m.id === missionId);
    if (mission) {
      const updatedMission = { ...mission, status: MissionStatus.IN_PROGRESS, startTime: new Date().toISOString() };
      set({ 
        currentMission: updatedMission,
        animationState: AnimationState.MOVING_TO_ORIGIN,
        assignedMissions: get().assignedMissions.map(m => m.id === missionId ? updatedMission : m)
      });
    }
  },
  
  completeBin: (binId) => {
    const current = get().currentMission;
    if (current) {
      const updatedBins = current.bins.map(bin => 
        bin.id === binId ? { ...bin, status: 'UNLOADED' as const } : bin
      );
      const completed = updatedBins.filter(b => b.status === 'UNLOADED').length;
      set({
        currentMission: {
          ...current,
          bins: updatedBins,
          progress: { completed, total: current.bins.length }
        }
      });
    }
  },
  
  completeMission: () => {
    const current = get().currentMission;
    if (current) {
      set({ 
        currentMission: null,
        animationState: AnimationState.COMPLETED,
        assignedMissions: get().assignedMissions.filter(m => m.id !== current.id)
      });
      setTimeout(() => {
        set({ animationState: AnimationState.IDLE });
      }, 2000);
    }
  },
  
  assignMission: (missionId) => {
    const mission = get().publicMissions.find(m => m.id === missionId);
    if (mission) {
      const assignedMission = { ...mission, assignedOperator: get().operator?.id };
      set({
        publicMissions: get().publicMissions.filter(m => m.id !== missionId),
        assignedMissions: [...get().assignedMissions, assignedMission]
      });
    }
  },

  // RFID
  rfidConnection: {
    status: RFIDStatus.DISCONNECTED,
  },
  rfidMessages: [],
  
  setRFIDConnection: (connection) => set({ rfidConnection: connection }),
  
  addRFIDMessage: (message) => {
    const messages = [message, ...get().rfidMessages].slice(0, 50); // Keep last 50 messages
    set({ rfidMessages: messages });
  },
  
  clearRFIDMessages: () => set({ rfidMessages: [] }),

  // Notifications
  notifications: [],
  
  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
    };
    set({ notifications: [...get().notifications, newNotification] });
    
    if (notification.autoClose !== false) {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, notification.duration || 5000);
    }
  },
  
  removeNotification: (id) => {
    set({ notifications: get().notifications.filter(n => n.id !== id) });
  },

  // Animation
  animationState: AnimationState.IDLE,
  setAnimationState: (state) => set({ animationState: state }),

  // UI State
  isMissionDrawerOpen: false,
  toggleMissionDrawer: () => set({ isMissionDrawerOpen: !get().isMissionDrawerOpen }),
  
  isManualMode: false,
  setManualMode: (mode) => set({ isManualMode: mode }),
  
  manualOperationsCount: 0,
  rfidOperationsCount: 0,
  incrementManualOperations: () => set({ manualOperationsCount: get().manualOperationsCount + 1 }),
  incrementRFIDOperations: () => set({ rfidOperationsCount: get().rfidOperationsCount + 1 }),
}));
