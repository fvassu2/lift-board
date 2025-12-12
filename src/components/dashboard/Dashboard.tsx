import React, { useState, useEffect } from 'react';
import { MissionProvider } from '../../contexts/MissionContext';
import { useMissionContext } from '../../contexts/useMissionContext';
import { RFIDProvider } from '../../contexts/RFIDContext';
import Header from './Header';
import CurrentMissionView from '../mission/CurrentMissionView';
import MissionDrawer from '../mission/MissionDrawer';
import ForkliftAnimation from '../animation/ForkliftAnimation';
import RFIDPanel from '../rfid/RFIDPanel';
import ActionToolbar from '../toolbar/ActionToolbar';
import { mockOperator } from '../../utils/mockData';
import { AlertCircle } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { currentMission, animationState, myMissions, publicMissions } = useMissionContext();

  // Initialize mock data
  useEffect(() => {
    // This would normally load from an API
    // For now, we'll use the mock data which is already in context
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Header */}
      <Header operator={mockOperator} onMenuClick={() => setIsDrawerOpen(true)} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Mission and Animation */}
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          {currentMission ? (
            <>
              <CurrentMissionView mission={currentMission} />
              <ForkliftAnimation animationState={animationState} />
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center h-full flex flex-col items-center justify-center">
              <AlertCircle size={64} className="text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Nessuna Missione Attiva
              </h2>
              <p className="text-gray-500 mb-6">
                Seleziona una missione per iniziare o prendine una in carico
              </p>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors touch-manipulation shadow-lg"
              >
                📋 Apri Missioni
              </button>
              
              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{myMissions.length}</div>
                  <div className="text-sm text-gray-600">Le Mie Missioni</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{publicMissions.length}</div>
                  <div className="text-sm text-gray-600">Disponibili</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - RFID Panel */}
        <div className="w-96 p-4">
          <RFIDPanel />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <ActionToolbar onOpenMissions={() => setIsDrawerOpen(true)} />

      {/* Mission Drawer */}
      <MissionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        operator={mockOperator}
      />
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <MissionProvider>
      <RFIDProvider>
        <DashboardContent />
      </RFIDProvider>
    </MissionProvider>
  );
};

export default Dashboard;
