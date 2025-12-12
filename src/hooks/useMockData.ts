import { useEffect } from 'react';
import { useMissionContext } from '../contexts/useMissionContext';
import { mockMyMissions } from '../utils/mockData';

export const useMockData = () => {
  const context = useMissionContext();

  useEffect(() => {
    // Initialize with mock data
    // In a real app, this would fetch from an API
    // Note: The context doesn't expose setMyMissions/setPublicMissions
    // This hook is currently not functional as designed
    // Missions are initialized directly in MissionContext
    
    // Set first in-progress mission as current
    const inProgressMission = mockMyMissions.find(m => m.status === 'IN_PROGRESS');
    if (inProgressMission && !context.currentMission) {
      context.setCurrentMission(inProgressMission);
    }
  }, [context]);
};
