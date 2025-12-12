import React, { useState } from 'react';
import { X, ArrowRight, AlertCircle } from 'lucide-react';
import type { Mission } from '../../types';
import { useMissionContext } from '../../contexts/useMissionContext';

interface MissionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  operator: { id: string; name: string };
}

const MissionDrawer: React.FC<MissionDrawerProps> = ({ isOpen, onClose, operator }) => {
  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my');
  const { myMissions, publicMissions, setCurrentMission, assignMission } = useMissionContext();

  const handleSelectMission = (mission: Mission) => {
    setCurrentMission(mission);
    onClose();
  };

  const handleAssignMission = (missionId: string) => {
    assignMission(missionId, operator.id);
  };

  const priorityColors = {
    HIGH: 'text-red-600',
    MEDIUM: 'text-yellow-600',
    LOW: 'text-green-600',
  };

  const priorityIcons = {
    HIGH: '🔴',
    MEDIUM: '🟡',
    LOW: '🟢',
  };

  const renderMission = (mission: Mission, isPublic = false) => (
    <div
      key={mission.id}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{priorityIcons[mission.priority]}</span>
          <span className="font-bold text-gray-800">{mission.id}</span>
          <span className={`text-sm font-semibold ${priorityColors[mission.priority]}`}>
            {mission.priority}
          </span>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {mission.type === 'IN' ? '📦 IN' : '📤 OUT'}
        </span>
      </div>

      <p className="font-semibold text-gray-800 mb-1">{mission.article.description}</p>
      <p className="text-sm text-gray-600 mb-3">{mission.quantityKg} KG • {mission.binsTotal} bins</p>

      <div className="flex items-center text-sm text-gray-700 mb-3">
        <span className="font-medium">{mission.from.name}</span>
        <ArrowRight size={16} className="mx-2 text-blue-500" />
        <span className="font-medium">{mission.to.name}</span>
      </div>

      {!isPublic && mission.status === 'IN_PROGRESS' && (
        <div className="flex items-center text-sm text-blue-600 mb-2">
          <AlertCircle size={16} className="mr-1" />
          In corso: {mission.binsCompleted}/{mission.binsTotal} bins
        </div>
      )}

      <button
        onClick={() => isPublic ? handleAssignMission(mission.id) : handleSelectMission(mission)}
        className={`w-full py-2 rounded-lg font-semibold transition-colors touch-manipulation ${
          isPublic
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isPublic ? 'Prendi in Carico' : 'Seleziona'}
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 h-full w-96 bg-gray-50 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Missioni</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500 rounded transition-colors touch-manipulation"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-white">
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-3 font-semibold transition-colors touch-manipulation ${
              activeTab === 'my'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Le Mie ({myMissions.length})
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`flex-1 py-3 font-semibold transition-colors touch-manipulation ${
              activeTab === 'public'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pubbliche ({publicMissions.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'my' ? (
            myMissions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Nessuna missione assegnata
              </div>
            ) : (
              myMissions
                .sort((a, b) => {
                  // Sort by status (IN_PROGRESS first) and then by priority
                  if (a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS') return -1;
                  if (a.status !== 'IN_PROGRESS' && b.status === 'IN_PROGRESS') return 1;
                  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .map(mission => renderMission(mission))
            )
          ) : (
            publicMissions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Nessuna missione pubblica disponibile
              </div>
            ) : (
              publicMissions
                .sort((a, b) => {
                  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .map(mission => renderMission(mission, true))
            )
          )}
        </div>
      </div>
    </>
  );
};

export default MissionDrawer;
