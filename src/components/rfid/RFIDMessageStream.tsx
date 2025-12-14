import { useEffect, useRef } from 'react';
import { Radio } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { RFIDEventType } from '../../types';

export const RFIDMessageStream = () => {
  const { rfidMessages } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [rfidMessages]);

  const getEventColor = (eventType: RFIDEventType) => {
    switch (eventType) {
      case RFIDEventType.READ:
        return 'bg-blue-100 text-blue-800';
      case RFIDEventType.WRITE:
        return 'bg-green-100 text-green-800';
      case RFIDEventType.ERROR:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-2 mb-3">
        <Radio className="text-primary-500" size={20} />
        <h3 className="text-lg font-bold text-gray-800">Stream Messaggi</h3>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-200"
      >
        {rfidMessages.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            <p className="text-sm">Nessun messaggio RFID</p>
          </div>
        ) : (
          rfidMessages.map((message, index) => (
            <div
              key={`${message.timestamp}-${index}`}
              className="bg-white rounded p-2 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString('it-IT')}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${getEventColor(message.eventType)}`}>
                  {message.eventType}
                </span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">Tag: {message.tagId}</div>
                {message.binId && (
                  <div className="text-gray-600">Bin: {message.binId}</div>
                )}
                {message.articleCode && (
                  <div className="text-gray-600">Articolo: {message.articleCode}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
