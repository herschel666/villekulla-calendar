import React from 'react';
import uuid from 'uuid';

const LS_KEY = 'villekulla-calendar:client-id';

export const useClientId = (): string | null => {
  const [clientId, setClient] = React.useState<string | null>(null);

  React.useEffect(() => {
    let storedClientId = localStorage.getItem(LS_KEY);

    if (!storedClientId) {
      storedClientId = uuid.v4();
      localStorage.setItem(LS_KEY, storedClientId);
    }

    setClient(storedClientId);
  }, []);

  return clientId;
};
