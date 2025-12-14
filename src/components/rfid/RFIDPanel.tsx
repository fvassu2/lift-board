import { RFIDStatus } from './RFIDStatus';
import { RFIDMessageStream } from './RFIDMessageStream';
import { RFIDNotifications } from './RFIDNotifications';

export const RFIDPanel = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <RFIDStatus />
      <div className="my-4 border-t border-gray-200" />
      <RFIDMessageStream />
      <div className="my-4 border-t border-gray-200" />
      <RFIDNotifications />
    </div>
  );
};
