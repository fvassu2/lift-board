import React, { useState } from 'react';
import { CheckCircle, Camera, AlertTriangle, List } from 'lucide-react';
import { useMissionContext } from '../../contexts/MissionContext';
import { useRFIDContext } from '../../contexts/RFIDContext';

interface ActionToolbarProps {
  onOpenMissions: () => void;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({ onOpenMissions }) => {
  const { currentMission, confirmPickup, confirmDelivery, setAnimationState } = useMissionContext();
  const { addMessage } = useRFIDContext();
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState('');

  const handleConfirmPickup = () => {
    if (!currentMission) return;

    addMessage({
      type: 'scan_confirmation',
      content: 'Prelievo confermato manualmente',
      level: 'success',
    });

    setAnimationState('moving_to_delivery');
    confirmPickup(currentMission.id);
  };

  const handleConfirmDelivery = () => {
    if (!currentMission) return;

    addMessage({
      type: 'scan_confirmation',
      content: 'Consegna confermata manualmente',
      level: 'success',
    });

    setAnimationState('complete');
    confirmDelivery(currentMission.id);
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcodeValue.trim()) {
      addMessage({
        type: 'tag_read',
        content: `Barcode scansionato: ${barcodeValue}`,
        level: 'info',
        tagId: barcodeValue,
      });
      setBarcodeValue('');
      setShowBarcodeInput(false);
    }
  };

  const handleReportProblem = () => {
    const problem = prompt('Descrivi il problema:');
    if (problem) {
      addMessage({
        type: 'error',
        content: `Problema segnalato: ${problem}`,
        level: 'error',
      });
      alert('Problema segnalato con successo. Un supervisore sarà notificato.');
    }
  };

  return (
    <div className="bg-white border-t shadow-lg p-4">
      <div className="flex items-center space-x-3 max-w-6xl mx-auto">
        {/* Missions Button */}
        <button
          onClick={onOpenMissions}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors touch-manipulation shadow-md"
        >
          <List size={20} />
          <span>Missioni</span>
        </button>

        {/* Conditional Mission Actions */}
        {currentMission && (
          <>
            {currentMission.status === 'ASSIGNED' && (
              <button
                onClick={() => {
                  setAnimationState('moving_to_pickup');
                  setTimeout(() => setAnimationState('picking_up'), 2000);
                }}
                className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors touch-manipulation shadow-md"
              >
                <CheckCircle size={20} />
                <span>Inizia Missione</span>
              </button>
            )}

            {(currentMission.status === 'IN_PROGRESS' && currentMission.binsCompleted < currentMission.binsTotal) && (
              <button
                onClick={handleConfirmPickup}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors touch-manipulation shadow-md"
              >
                <CheckCircle size={20} />
                <span>✓ Conferma Prelievo</span>
              </button>
            )}

            {(currentMission.status === 'IN_PROGRESS' && currentMission.binsCompleted >= currentMission.binsTotal) && (
              <button
                onClick={handleConfirmDelivery}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors touch-manipulation shadow-md"
              >
                <CheckCircle size={20} />
                <span>✓ Conferma Consegna</span>
              </button>
            )}
          </>
        )}

        {/* Barcode Scanner */}
        <div className="flex-1 flex items-center space-x-2">
          {showBarcodeInput ? (
            <form onSubmit={handleBarcodeSubmit} className="flex-1 flex space-x-2">
              <input
                type="text"
                value={barcodeValue}
                onChange={(e) => setBarcodeValue(e.target.value)}
                placeholder="Inserisci barcode..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors touch-manipulation"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBarcodeInput(false);
                  setBarcodeValue('');
                }}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors touch-manipulation"
              >
                Annulla
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowBarcodeInput(true)}
              className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors touch-manipulation shadow-md"
            >
              <Camera size={20} />
              <span>📷 Scan Barcode</span>
            </button>
          )}
        </div>

        {/* Report Problem */}
        <button
          onClick={handleReportProblem}
          className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors touch-manipulation shadow-md"
        >
          <AlertTriangle size={20} />
          <span>⚠ Problema</span>
        </button>
      </div>
    </div>
  );
};

export default ActionToolbar;
