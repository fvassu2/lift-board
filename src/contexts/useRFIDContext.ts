import { useContext } from 'react';
import { RFIDContext } from './RFIDContextDefinition';

export const useRFIDContext = () => {
  const context = useContext(RFIDContext);
  if (!context) {
    throw new Error('useRFIDContext must be used within RFIDProvider');
  }
  return context;
};
