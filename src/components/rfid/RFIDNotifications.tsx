import { Bell, CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { NotificationType } from '../../types';

export const RFIDNotifications = () => {
  const { notifications, removeNotification } = useStore();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return <CheckCircle size={20} />;
      case NotificationType.WARNING:
        return <AlertTriangle size={20} />;
      case NotificationType.ERROR:
        return <XCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'bg-green-50 border-green-200 text-green-800';
      case NotificationType.WARNING:
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case NotificationType.ERROR:
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Bell className="text-primary-500" size={20} />
        <h3 className="text-lg font-bold text-gray-800">Notifiche</h3>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            <p className="text-sm">Nessuna notifica</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg p-3 border-2 ${getNotificationColor(notification.type)} flex items-start gap-2`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold break-words">{notification.message}</p>
                <p className="text-xs opacity-75 mt-1">
                  {new Date(notification.timestamp).toLocaleTimeString('it-IT')}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 hover:opacity-70 transition-opacity touch-manipulation min-w-[24px] min-h-[24px]"
                aria-label="Chiudi notifica"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
