import React from 'react';
import type { Mission } from '../../types';
import { ArrowRight, Package, AlertCircle } from 'lucide-react';

interface CurrentMissionViewProps {
  mission: Mission;
}

const CurrentMissionView: React.FC<CurrentMissionViewProps> = ({ mission }) => {
  const progressPercentage = (mission.binsCompleted / mission.binsTotal) * 100;
  
  const priorityColors = {
    HIGH: 'bg-red-500 text-white',
    MEDIUM: 'bg-yellow-500 text-white',
    LOW: 'bg-green-500 text-white',
  };

  const typeIcons = {
    IN: '📦 IN',
    OUT: '📤 OUT',
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'warehouse': return '🏭';
      case 'zone': return '🅿️';
      case 'line': return '🔄';
      default: return '📍';
    }
  };

  const currentStep = mission.status === 'ASSIGNED' 
    ? `Vai a: ${mission.from.name}`
    : mission.binsCompleted < mission.binsTotal
    ? `Preleva da: ${mission.from.name}`
    : `Consegna a: ${mission.to.name}`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-800">{mission.id}</h2>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
              {typeIcons[mission.type]}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityColors[mission.priority]}`}>
              {mission.priority}
            </span>
          </div>
          <div className="flex items-center text-lg text-blue-600 font-semibold">
            <AlertCircle size={20} className="mr-2" />
            {currentStep}
          </div>
        </div>
      </div>

      {/* Article Details */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">ARTICOLO</h3>
          <p className="text-xl font-bold text-gray-800 mb-1">{mission.article.description}</p>
          <p className="text-sm text-gray-500">Codice: {mission.article.code}</p>
          <p className="text-sm text-gray-500">Quantità: {mission.quantityKg} KG</p>
        </div>
        
        {mission.article.imageUrl && (
          <div className="flex justify-center">
            <img
              src={mission.article.imageUrl}
              alt={mission.article.description}
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      {/* Route */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">PERCORSO</h3>
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 flex-1">
            <span className="text-3xl">{getLocationIcon(mission.from.type)}</span>
            <div>
              <div className="text-xs text-gray-500 uppercase">Da</div>
              <div className="text-lg font-bold text-gray-800">{mission.from.name}</div>
            </div>
          </div>
          
          <ArrowRight size={32} className="text-blue-500 mx-4 flex-shrink-0" />
          
          <div className="flex items-center space-x-3 flex-1 justify-end">
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase">A</div>
              <div className="text-lg font-bold text-gray-800">{mission.to.name}</div>
            </div>
            <span className="text-3xl">{getLocationIcon(mission.to.type)}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-600">BINS MOVIMENTATI</h3>
          <span className="text-lg font-bold text-gray-800">
            {mission.binsCompleted}/{mission.binsTotal} ({Math.round(progressPercentage)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-500 flex items-center justify-center text-white text-xs font-semibold"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 10 && `${Math.round(progressPercentage)}%`}
          </div>
        </div>
      </div>

      {/* Bins Icons */}
      <div className="flex space-x-2">
        {Array.from({ length: mission.binsTotal }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-12 rounded flex items-center justify-center ${
              i < mission.binsCompleted
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Package size={20} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentMissionView;
