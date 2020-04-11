/* eslint @typescript-eslint/no-non-null-assertion: "off" */

import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RouteProps } from 'react-router';
import format from 'date-fns/format';
import { render, fireEvent, waitFor } from '@testing-library/react';

jest.mock('../../../hooks/use-user', () => ({
  useUser: () => ({ username: 'test' }),
}));
jest.mock('../../../hooks/use-calendar-entries', () => {
  return { useCalendarEntries: () => [] };
});

it('should be possible to abort', async () => {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const { App } = require('..');
  let location: RouteProps['location'] | undefined;
  const date = new Date();
  const month = format(date, 'yyyy-MM');
  const app = render(
    <MemoryRouter initialEntries={[`/calendar/new/?date=${month}-28`]}>
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

  const abort = await app.findByText('Abbrechen');
  fireEvent.click(abort);
  await waitFor(() => void 0);

  expect(location).toBeDefined();
  expect(location!.pathname).toBe(`/calendar/${month}/`);
  expect(app.queryByText('Abbrechen')).toBe(null);
});
