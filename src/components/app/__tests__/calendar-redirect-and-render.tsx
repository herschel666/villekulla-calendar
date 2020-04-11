/* eslint @typescript-eslint/no-non-null-assertion: "off" */

import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RouteProps } from 'react-router';
import format from 'date-fns/format';
import { render } from '@testing-library/react';

jest.mock('../../../hooks/use-user', () => ({
  useUser: () => ({ username: 'test' }),
}));
jest.mock('../../../hooks/use-calendar-entries', () => {
  return { useCalendarEntries: () => [] };
});

it('should render the app & redirects to the current month view', async () => {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const { App } = require('..');
  let location: RouteProps['location'] | undefined;
  const app = await render(
    <MemoryRouter>
      <App />
      <Route
        path="*"
        render={({ location: reactRouterLocation }) => {
          location = reactRouterLocation;
          return null;
        }}
      />
    </MemoryRouter>
  );
  const date = new Date();

  await app.findByTestId('calendar');
  expect(location!.pathname).toBe(`/calendar/${format(date, 'yyyy-MM')}/`);
});
