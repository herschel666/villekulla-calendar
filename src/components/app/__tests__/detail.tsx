/* eslint @typescript-eslint/no-non-null-assertion: "off" */

import React, { FunctionComponent } from 'react';
import format from 'date-fns/format';
import { render, fireEvent, act, wait } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RouteProps } from 'react-router';

jest.mock('../../../hooks/use-user', () => ({
  useUser: () => ({ username: 'test' }),
}));
jest.mock('react-router-dom', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createElement, Fragment, Children } = require('react');
  const mod = jest.requireActual('react-router-dom');
  const BrowserRouter: FunctionComponent = ({ children }) =>
    createElement(Fragment, void 0, Children.only(children));
  return { ...mod, BrowserRouter };
});
jest.mock('aws-amplify', () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const { graphqlOperation } = jest.requireActual('aws-amplify');
  const item = {
    id: 'a2278981-b0cf-4d5e-9cec-07bd7272eadb',
    title: 'My awesome event!',
    start: new Date(year, month, 18, 5, 30),
    end: new Date(year, month, 18, 8, 0),
    description: 'Lorem ipsum dolor.',
    creator: 'horst',
  };
  const graphql = jest
    .fn()
    .mockResolvedValueOnce({ data: { listCalendarEntrys: { items: [item] } } })
    .mockResolvedValueOnce({ data: { getCalendarEntry: item } });
  const API = { graphql };
  return { graphqlOperation, API };
});

it('displays the event details', async () => {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const { App } = require('..');
  let location: RouteProps['location'] | undefined;
  const date = new Date();
  const month = format(date, 'yyyy-MM');
  const app = await render(
    <MemoryRouter initialEntries={[`/calendar/${month}/`]}>
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
  await wait();
  const entry = await app.getByText('My awesome event!');

  act(() => void fireEvent.click(entry));
  await wait();

  expect(location!.pathname).toBe(
    '/detail/a2278981-b0cf-4d5e-9cec-07bd7272eadb/'
  );
  app.getByText('My awesome event!');
  app.getByText(
    format(new Date(date.getFullYear(), date.getMonth(), 18), 'dd.MM.yyyy')
  );
  app.getByText(/05:30 Uhr bis 08:00 Uhr/);
  app.getByText('Lorem ipsum dolor.');
  expect(await app.queryByText('Termin löschen')).toBe(null);
});
