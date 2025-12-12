import React, { useState, useCallback, type ReactNode } from 'react';
import type { Mission, MissionStatus, AnimationState } from '../types';
import { MissionContext, type MissionContextType } from './MissionContextDefinition';

interface MissionProviderProps {
  children: ReactNode;
}

export const MissionProvider: React.FC<MissionProviderProps> = ({ children }) => {
  // Import mock data for initial state
  const mockMyMissions: Mission[] = [
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
      from: { id: 'LOC001', name: 'Piazzale-02', type: 'zone' },
      to: { id: 'LOC002', name: 'A-12-05', type: 'warehouse' },
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
      from: { id: 'LOC003', name: 'B-03-04', type: 'warehouse' },
      to: { id: 'LOC004', name: 'Linea-01', type: 'line' },
      binsTotal: 8,
      binsCompleted: 0,
      quantityKg: 30,
      assignedTo: 'OP001',
      createdAt: '2025-12-12T09:45:00Z',
    },
  ];

  const mockPublicMissions: Mission[] = [
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
      from: { id: 'LOC007', name: 'A-08-15', type: 'warehouse' },
      to: { id: 'LOC008', name: 'Linea-02', type: 'line' },
      binsTotal: 12,
      binsCompleted: 0,
      quantityKg: 60,
      createdAt: '2025-12-12T10:15:00Z',
    },
  ];

  const inProgressMission = mockMyMissions.find(m => m.status === 'IN_PROGRESS') || null;

  const [currentMission, setCurrentMissionState] = useState<Mission | null>(inProgressMission);
  const [myMissions, setMyMissions] = useState<Mission[]>(mockMyMissions);
  const [publicMissions, setPublicMissions] = useState<Mission[]>(mockPublicMissions);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');

  const setCurrentMission = useCallback((mission: Mission | null) => {
    setCurrentMissionState(mission);
    if (mission) {
      setAnimationState('idle');
    }
  }, []);

  const updateMissionStatus = useCallback((missionId: string, status: MissionStatus) => {
    const updateMission = (missions: Mission[]) =>
      missions.map(m => {
        if (m.id === missionId) {
          const updated = { ...m, status };
          if (status === 'IN_PROGRESS' && !m.startedAt) {
            updated.startedAt = new Date().toISOString();
          } else if (status === 'COMPLETED' && !m.completedAt) {
            updated.completedAt = new Date().toISOString();
          }
          return updated;
        }
        return m;
      });

    setMyMissions(updateMission);
    setPublicMissions(updateMission);
    
    if (currentMission?.id === missionId) {
      setCurrentMissionState(prev => prev ? { ...prev, status } : null);
    }
  }, [currentMission]);

  const assignMission = useCallback((missionId: string, operatorId: string) => {
    const mission = publicMissions.find(m => m.id === missionId);
    if (mission) {
      const assignedMission = { ...mission, assignedTo: operatorId, status: 'ASSIGNED' as MissionStatus };
      setPublicMissions(prev => prev.filter(m => m.id !== missionId));
      setMyMissions(prev => [...prev, assignedMission]);
    }
  }, [publicMissions]);

  const confirmPickup = useCallback((missionId: string) => {
    updateMissionStatus(missionId, 'IN_PROGRESS');
    setAnimationState('moving_to_delivery');
  }, [updateMissionStatus]);

  const confirmDelivery = useCallback((missionId: string) => {
    updateMissionStatus(missionId, 'COMPLETED');
    setAnimationState('complete');
    
    // Auto-load next mission after 2 seconds
    setTimeout(() => {
      const nextMission = myMissions.find(m => m.status === 'ASSIGNED');
      if (nextMission) {
        setCurrentMission(nextMission);
      } else {
        setCurrentMission(null);
      }
    }, 2000);
  }, [updateMissionStatus, myMissions, setCurrentMission]);

  const updateBinsProgress = useCallback((missionId: string, completed: number) => {
    const updateProgress = (missions: Mission[]) =>
      missions.map(m => m.id === missionId ? { ...m, binsCompleted: completed } : m);

    setMyMissions(updateProgress);
    if (currentMission?.id === missionId) {
      setCurrentMissionState(prev => prev ? { ...prev, binsCompleted: completed } : null);
    }
  }, [currentMission]);

  const value: MissionContextType = {
    currentMission,
    myMissions,
    publicMissions,
    animationState,
    setCurrentMission,
    updateMissionStatus,
    assignMission,
    confirmPickup,
    confirmDelivery,
    updateBinsProgress,
    setAnimationState,
  };

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
};
