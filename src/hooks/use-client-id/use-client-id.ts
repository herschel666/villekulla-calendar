import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const LS_KEY = 'villekulla-calendar:client-id';

export const useClientId = (): string | null => {
  const [clientId, setClient] = React.useState<string | null>(null);

  React.useEffect(() => {
    let storedClientId = localStorage.getItem(LS_KEY);

    if (!storedClientId) {
      storedClientId = uuidv4();
      localStorage.setItem(LS_KEY, storedClientId);
    }

    setClient(storedClientId);
  }, []);

  return clientId;
};
