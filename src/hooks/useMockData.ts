import { useEffect } from 'react';
import { useMissionContext } from '../contexts/useMissionContext';
import { mockMyMissions } from '../utils/mockData';

export const useMockData = () => {
  const context = useMissionContext();

  useEffect(() => {
    // Initialize with mock data
    // In a real app, this would fetch from an API
    
    // Set first in-progress mission as current
    const inProgressMission = mockMyMissions.find(m => m.status === 'IN_PROGRESS');
    if (inProgressMission && !context.currentMission) {
      context.setCurrentMission(inProgressMission);
    }
    // Note: myMissions and publicMissions are initialized in the provider itself
  }, [context]);
};
