import { useEffect } from 'react';
import { useMissionContext } from '../contexts/MissionContext';
import { mockMyMissions, mockPublicMissions } from '../utils/mockData';

export const useMockData = () => {
  const context = useMissionContext();

  useEffect(() => {
    // Initialize with mock data
    // In a real app, this would fetch from an API
    const myMissionsState = context as any;
    
    // Set initial missions
    if (myMissionsState.myMissions?.length === 0) {
      myMissionsState.setMyMissions?.(mockMyMissions);
    }
    if (myMissionsState.publicMissions?.length === 0) {
      myMissionsState.setPublicMissions?.(mockPublicMissions);
    }

    // Set first in-progress mission as current
    const inProgressMission = mockMyMissions.find(m => m.status === 'IN_PROGRESS');
    if (inProgressMission && !context.currentMission) {
      context.setCurrentMission(inProgressMission);
    }
  }, []);
};
