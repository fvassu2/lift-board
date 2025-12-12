import { useState, useEffect } from 'react';
import type { Mission } from '../../types/mission';
import ForkliftAnimation from './ForkliftAnimation';
import './MissionCard.css';

interface MissionCardProps {
  mission: Mission;
  onStart: () => void;
  onCompleteBin: () => void;
  onCompleteMission: () => void;
  onReportIssue: () => void;
}

const MissionCard = ({
  mission,
  onStart,
  onCompleteBin,
  onCompleteMission,
  onReportIssue
}: MissionCardProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (mission.status === 'IN_PROGRESS') {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mission.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (mission.completedBins / mission.totalBins) * 100;

  return (
    <div className="mission-card">
      <div className="mission-header">
        <h2>MISSIONE CORRENTE: {mission.code}</h2>
        <span className={`mission-type ${mission.type.toLowerCase()}`}>
          {mission.type}
        </span>
      </div>

      <div className="article-section">
        <div className="article-photo">
          {mission.article.photoUrl ? (
            <img src={mission.article.photoUrl} alt={mission.article.description} />
          ) : (
            <div className="photo-placeholder">📦</div>
          )}
        </div>
        <div className="article-info">
          <h3>{mission.article.description}</h3>
          <p className="article-code">{mission.article.code}</p>
          <p className="mission-summary">
            {mission.totalBins} bins - {mission.totalWeight} KG totali
          </p>
        </div>
      </div>

      <div className="route-section">
        <div className="location origin">
          <span className="location-label">DA:</span>
          <span className="location-name">{mission.origin.name}</span>
          <span className="location-code">({mission.origin.code})</span>
        </div>
        <div className="route-arrow">↓</div>
        <div className="location destination">
          <span className="location-label">A:</span>
          <span className="location-name">{mission.destination.name}</span>
          <span className="location-code">({mission.destination.code})</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="progress-text">
          Progresso: {mission.completedBins}/{mission.totalBins} bins
        </div>
      </div>

      <div className="timer-section">
        <span className="timer-label">Tempo:</span>
        <span className="timer-value">{formatTime(elapsedTime)}</span>
      </div>

      <ForkliftAnimation mission={mission} />

      <div className="action-buttons">
        {mission.status === 'PENDING' && (
          <button className="btn-primary btn-large" onClick={onStart}>
            ⏯ Avvia Missione
          </button>
        )}
        {mission.status === 'IN_PROGRESS' && (
          <>
            <button className="btn-success btn-large" onClick={onCompleteBin}>
              ✓ Completa Bin
            </button>
            <button className="btn-primary btn-large" onClick={onCompleteMission}>
              🏁 Completa Missione
            </button>
          </>
        )}
        <button className="btn-warning btn-large" onClick={onReportIssue}>
          ⚠ Segnala Problema
        </button>
      </div>
    </div>
  );
};

export default MissionCard;
