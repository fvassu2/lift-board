import { useState } from 'react';
import Header from './Header';
import MissionCard from './MissionCard';
import RFIDPanel from './RFIDPanel';
import ManualToolbar from './ManualToolbar';
import MissionsDrawer from './MissionsDrawer';
import type { Mission, Operator } from '../../types/mission';
import './OperatorDashboard.css';

const OperatorDashboard = () => {
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [operator] = useState<Operator>({
    id: 'OP001',
    name: 'Mario Rossi',
    shift: '06:00 - 14:00'
  });

  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="operator-dashboard">
      <Header 
        operator={operator} 
        onMenuClick={handleToggleDrawer}
      />
      
      <div className="dashboard-content">
        <main className="main-content">
          {currentMission ? (
            <MissionCard 
              mission={currentMission}
              onStart={() => console.log('Start mission')}
              onCompleteBin={() => console.log('Complete bin')}
              onCompleteMission={() => console.log('Complete mission')}
              onReportIssue={() => console.log('Report issue')}
            />
          ) : (
            <div className="no-mission">
              <h2>Nessuna missione attiva</h2>
              <p>Seleziona una missione dal pannello per iniziare</p>
              <button onClick={handleToggleDrawer} className="btn-primary">
                Visualizza Missioni
              </button>
            </div>
          )}
        </main>

        <aside className="rfid-sidebar">
          <RFIDPanel />
        </aside>
      </div>

      <ManualToolbar />

      <MissionsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectMission={setCurrentMission}
      />
    </div>
  );
};

export default OperatorDashboard;
