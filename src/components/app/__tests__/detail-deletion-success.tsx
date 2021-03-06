/* eslint @typescript-eslint/no-non-null-assertion: "off" */

import React from 'react';
import format from 'date-fns/format';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RouteProps } from 'react-router';

jest.mock('../../../hooks/use-user', () => ({
  useUser: () => ({ username: 'test' }),
}));
jest.mock('@aws-amplify/api', () => {
  const { graphqlOperation } = jest.requireActual('@aws-amplify/api');
  const item = {
    id: '1',
    title: 'My awesome event!',
    start: new Date(),
    end: new Date(new Date(Date.now() + 1000 * 60 * 60)),
    description: 'Lorem ipsum dolor.',
    creator: 'test',
  };
  const graphql = jest
    .fn()
    .mockResolvedValueOnce({ data: { getCalendarEntry: item } })
    .mockResolvedValueOnce({ data: {} });
  const API = { graphql };
  return { graphqlOperation, API };
});
jest.mock('../../../hooks/use-calendar-entries', () => {
  return { useCalendarEntries: () => [] };
});

window.confirm = () => true;

it('deletes the entry', async () => {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const { App } = require('..');
  let location: RouteProps['location'] | undefined;
  const date = new Date();
  const month = format(date, 'yyyy-MM');
  const app = render(
    <MemoryRouter initialEntries={['/detail/1/']}>
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
  const btn = await app.findByText('Termin löschen');

  fireEvent.click(btn);
  await app.findByText('Heute');
  expect(location!.pathname).toBe(`/calendar/${month}/`);
});
