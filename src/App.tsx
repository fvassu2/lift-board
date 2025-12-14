import { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { CurrentMission } from './components/mission/CurrentMission';
import { ForkliftAnimation } from './components/animation/ForkliftAnimation';
import { RFIDPanel } from './components/rfid/RFIDPanel';
import { MissionDrawer } from './components/mission/MissionDrawer';
import { ManualToolbar } from './components/toolbar/ManualToolbar';
import { useStore } from './store/useStore';
import { useRFIDSimulation } from './hooks/useRFIDSimulation';
import { mockMissions } from './utils/mockData';

function App() {
  const { setCurrentMission, setAssignedMissions, setPublicMissions } = useStore();

  // Initialize with mock data
  useEffect(() => {
    const currentMissionData = mockMissions[0];
    const assignedMissionsData = mockMissions.slice(0, 3);
    const publicMissionsData = mockMissions.slice(3);

    setCurrentMission(currentMissionData);
    setAssignedMissions(assignedMissionsData);
    setPublicMissions(publicMissionsData);
  }, [setCurrentMission, setAssignedMissions, setPublicMissions]);

  // Simulate RFID connection
  useRFIDSimulation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 overflow-hidden">
        <div className="h-full flex gap-4">
          {/* Left Column - Mission and Animation */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            <CurrentMission />
            <ForkliftAnimation />
          </div>

          {/* Right Column - RFID Panel */}
          <div className="w-80 flex-shrink-0 overflow-y-auto">
            <RFIDPanel />
          </div>
        </div>
      </main>

      {/* Manual Toolbar at Bottom */}
      <ManualToolbar />

      {/* Mission Drawer */}
      <MissionDrawer />
    </div>
  );
}

export default App;
