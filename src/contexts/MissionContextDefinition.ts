import { createContext } from 'react';
import type { Mission, MissionStatus, AnimationState } from '../types';

export interface MissionContextType {
  currentMission: Mission | null;
  myMissions: Mission[];
  publicMissions: Mission[];
  animationState: AnimationState;
  setCurrentMission: (mission: Mission | null) => void;
  updateMissionStatus: (missionId: string, status: MissionStatus) => void;
  assignMission: (missionId: string, operatorId: string) => void;
  confirmPickup: (missionId: string) => void;
  confirmDelivery: (missionId: string) => void;
  updateBinsProgress: (missionId: string, completed: number) => void;
  setAnimationState: (state: AnimationState) => void;
}

export const MissionContext = createContext<MissionContextType | undefined>(undefined);
