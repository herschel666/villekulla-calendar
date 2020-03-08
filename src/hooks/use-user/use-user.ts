import React from 'react';
import { Auth } from 'aws-amplify';

export const useUser = (): { username: string } | null => {
  const [user, setUser] = React.useState(null);

  React.useEffect(
    () =>
      void Auth.currentAuthenticatedUser().then((result) => setUser(result)),
    []
  );

  return user;
};
