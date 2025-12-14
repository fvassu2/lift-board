import { X, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Mission } from '../../types';
import { MissionPriority } from '../../types';

export const MissionDrawer = () => {
  const { 
    isMissionDrawerOpen, 
    toggleMissionDrawer, 
    assignedMissions, 
    publicMissions,
    setCurrentMission,
    assignMission,
  } = useStore();

  if (!isMissionDrawerOpen) return null;

  const getPriorityColor = (priority: MissionPriority) => {
    switch (priority) {
      case MissionPriority.HIGH:
        return 'bg-red-100 text-red-800 border-red-200';
      case MissionPriority.MEDIUM:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case MissionPriority.LOW:
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSelectMission = (mission: Mission) => {
    setCurrentMission(mission);
    toggleMissionDrawer();
  };

  const handleAssignMission = (missionId: string) => {
    assignMission(missionId);
  };

  const renderMission = (mission: Mission, isPublic: boolean = false) => {
    return (
      <div
        key={mission.id}
        className="bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200 hover:border-primary-300 transition-colors"
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-bold text-gray-800">{mission.code}</h4>
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(mission.priority)}`}>
              {mission.priority === MissionPriority.HIGH ? 'Alta Priorità' :
               mission.priority === MissionPriority.MEDIUM ? 'Media' :
               'Bassa'}
            </span>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            mission.type === 'IN_ENTRATA' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {mission.type}
          </span>
        </div>
        
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-700">{mission.article.description}</p>
          <p className="text-xs text-gray-500">{mission.article.code}</p>
        </div>

        <div className="mb-3 text-sm text-gray-600 flex items-center gap-1">
          <span className="font-semibold">{mission.origin.name}</span>
          <ArrowRight size={16} className="text-gray-400" />
          <span className="font-semibold">{mission.destination.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            ~{mission.estimatedTime} min
          </span>
          {isPublic ? (
            <button
              onClick={() => handleAssignMission(mission.id)}
              className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2 px-4 rounded transition-colors touch-manipulation min-h-[36px]"
            >
              Assegnami
            </button>
          ) : (
            <button
              onClick={() => handleSelectMission(mission)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded transition-colors touch-manipulation min-h-[36px]"
            >
              Seleziona
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleMissionDrawer}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-96 bg-gray-50 shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-primary-600 text-white p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">Missioni Disponibili</h2>
          <button
            onClick={toggleMissionDrawer}
            className="p-2 hover:bg-primary-700 rounded transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Chiudi drawer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {/* Assigned Missions */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              📋 Assegnate a Te
            </h3>
            <div className="space-y-3">
              {assignedMissions.length === 0 ? (
                <div className="text-center text-gray-500 py-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-sm">Nessuna missione assegnata</p>
                </div>
              ) : (
                assignedMissions.map((mission) => renderMission(mission, false))
              )}
            </div>
          </div>

          {/* Public Missions */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              🌐 Pubbliche
            </h3>
            <div className="space-y-3">
              {publicMissions.length === 0 ? (
                <div className="text-center text-gray-500 py-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-sm">Nessuna missione pubblica disponibile</p>
                </div>
              ) : (
                publicMissions.map((mission) => renderMission(mission, true))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
