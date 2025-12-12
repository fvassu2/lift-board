import { BinFilters } from './BinFilters';
import { WarehouseMap } from './WarehouseMap';
import { BinList } from './BinList';
import { MissionFilters } from './MissionFilters';
import { MissionList } from './MissionList';
import { CreateMissionModal } from './CreateMissionModal';
import './Dashboard.css';

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Mission Manager Dashboard</h1>
        <p className="dashboard-subtitle">Gestione Missioni di Trasferimento</p>
      </header>
      
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <BinFilters />
        </aside>
        
        <main className="dashboard-main">
          <section className="dashboard-section">
            <WarehouseMap />
          </section>
          
          <section className="dashboard-section">
            <BinList />
          </section>
          
          <section className="dashboard-section">
            <MissionFilters />
            <MissionList />
          </section>
        </main>
      </div>
      
      <CreateMissionModal />
    </div>
  );
};
