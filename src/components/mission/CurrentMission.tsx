import { Play, CheckCircle, Flag, AlertTriangle, ArrowDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { MissionStatus, NotificationType } from '../../types';

export const CurrentMission = () => {
  const { currentMission, startMission, completeBin, completeMission, addNotification } = useStore();

  if (!currentMission) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Flag size={64} className="mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-600 mb-2">Nessuna Missione Attiva</h2>
        <p className="text-gray-500">Seleziona una missione dal menu per iniziare</p>
      </div>
    );
  }

  const { article, bins, origin, destination, progress, code, type, status, startTime } = currentMission;
  
  const elapsedTime = startTime ? Math.floor((Date.now() - new Date(startTime).getTime()) / 1000 / 60) : 0;
  const totalWeight = bins.reduce((sum, bin) => sum + bin.quantity, 0);
  const progressPercentage = (progress.completed / progress.total) * 100;

  const nextPendingBin = bins.find(b => b.status === 'PENDING' || b.status === 'IN_LOADING' || b.status === 'LOADED');

  const handleStartMission = () => {
    if (status === MissionStatus.PENDING) {
      startMission(currentMission.id);
      addNotification({
        type: NotificationType.INFO,
        message: `Missione ${code} avviata`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleCompleteBin = () => {
    if (nextPendingBin) {
      completeBin(nextPendingBin.id);
      addNotification({
        type: NotificationType.SUCCESS,
        message: `Bin ${nextPendingBin.code} completato`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleCompleteMission = () => {
    if (progress.completed === progress.total) {
      completeMission();
      addNotification({
        type: NotificationType.SUCCESS,
        message: `Missione ${code} completata con successo!`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleReportIssue = () => {
    addNotification({
      type: NotificationType.WARNING,
      message: 'Segnalazione problema inviata',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Missione: {code}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            type === 'IN_ENTRATA' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {type}
          </span>
        </div>
      </div>

      {/* Article Photo */}
      {article.photoUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img 
            src={article.photoUrl} 
            alt={article.description}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Article Info */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">{article.description}</h3>
        <p className="text-gray-600">Codice: {article.code}</p>
        <p className="text-gray-600">{bins.length} bins - {totalWeight} KG totali</p>
      </div>

      {/* Origin & Destination */}
      <div className="mb-4 bg-gray-50 rounded-lg p-4">
        <div className="mb-3">
          <p className="text-sm text-gray-600 font-semibold">DA:</p>
          <p className="text-lg font-bold text-gray-800">{origin.name}</p>
        </div>
        <div className="flex justify-center my-2">
          <ArrowDown size={24} className="text-primary-500" />
        </div>
        <div>
          <p className="text-sm text-gray-600 font-semibold">A:</p>
          <p className="text-lg font-bold text-gray-800">
            {destination.name} {destination.warehouse && `(${destination.warehouse})`}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Progresso: {progress.completed}/{progress.total} bins
          </span>
          <span className="text-sm text-gray-600">
            Tempo: {elapsedTime} min
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-primary-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Bins Status */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Stato Bins:</h4>
        <div className="grid grid-cols-5 gap-2">
          {bins.map((bin) => (
            <div
              key={bin.id}
              className={`p-2 rounded text-center text-xs font-semibold ${
                bin.status === 'UNLOADED' ? 'bg-green-100 text-green-800' :
                bin.status === 'LOADED' ? 'bg-blue-100 text-blue-800' :
                bin.status === 'IN_LOADING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-600'
              }`}
            >
              {bin.code}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {status === MissionStatus.PENDING && (
          <button
            onClick={handleStartMission}
            className="col-span-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors touch-manipulation min-h-[44px]"
          >
            <Play size={20} />
            Avvia Missione
          </button>
        )}
        
        {status === MissionStatus.IN_PROGRESS && (
          <>
            <button
              onClick={handleCompleteBin}
              disabled={!nextPendingBin}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors touch-manipulation min-h-[44px]"
            >
              <CheckCircle size={20} />
              Completa Bin
            </button>
            
            <button
              onClick={handleCompleteMission}
              disabled={progress.completed !== progress.total}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors touch-manipulation min-h-[44px]"
            >
              <Flag size={20} />
              Completa Missione
            </button>
          </>
        )}
        
        <button
          onClick={handleReportIssue}
          className="col-span-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors touch-manipulation min-h-[44px]"
        >
          <AlertTriangle size={20} />
          Segnala Problema
        </button>
      </div>
    </div>
  );
};
