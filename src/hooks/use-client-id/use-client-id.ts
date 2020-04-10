import React from 'react';
import { nanoid } from 'nanoid';

const LS_KEY = 'villekulla-calendar:client-id';

export const useClientId = (): string | null => {
  const [clientId, setClient] = React.useState<string | null>(null);

  React.useEffect(() => {
    let storedClientId = localStorage.getItem(LS_KEY);

    if (!storedClientId) {
      storedClientId = nanoid();
      localStorage.setItem(LS_KEY, storedClientId);
    }

    setClient(storedClientId);
  }, []);

  return clientId;
};
