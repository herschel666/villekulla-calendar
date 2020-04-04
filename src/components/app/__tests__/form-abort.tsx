/* eslint @typescript-eslint/no-non-null-assertion: "off" */

import React, { FunctionComponent } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RouteProps } from 'react-router';
import format from 'date-fns/format';
import {
  render,
  fireEvent,
  act,
  waitForDomChange,
} from '@testing-library/react';

jest.mock('react-router-dom', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createElement, Fragment, Children } = require('react');
  const mod = jest.requireActual('react-router-dom');
  const BrowserRouter: FunctionComponent = ({ children }) =>
    createElement(Fragment, void 0, Children.only(children));
  return { ...mod, BrowserRouter };
});
jest.mock('../../../hooks/use-user', () => ({
  useUser: () => 'test',
}));
jest.mock('aws-amplify', () => {
  const { graphqlOperation } = jest.requireActual('aws-amplify');
  const graphql = jest
    .fn()
    .mockResolvedValue({ data: { listCalendarEntrys: { items: [] } } });
  const API = { graphql };
  return { graphqlOperation, API };
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
  await act(async () => {
    await waitForDomChange();
  });

  expect(location).toBeDefined();
  expect(location!.pathname).toBe(`/calendar/${month}/`);
});
