import { useContext } from 'react';
import { MissionContext } from './MissionContextDefinition';

export const useMissionContext = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMissionContext must be used within MissionProvider');
  }
  return context;
};
