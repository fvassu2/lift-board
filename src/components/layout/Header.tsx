import { Menu, Clock } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Header = () => {
  const { operator, toggleMissionDrawer } = useStore();
  const currentTime = new Date().toLocaleTimeString('it-IT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <header className="bg-primary-600 text-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMissionDrawer}
            className="p-2 hover:bg-primary-700 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle mission drawer"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Dashboard Operatore</h1>
            <p className="text-sm text-primary-100">
              {operator?.name} {operator?.shift && `- Turno ${operator.shift}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-primary-100">
          <Clock size={20} />
          <span className="text-lg font-semibold">{currentTime}</span>
        </div>
      </div>
    </header>
  );
};
