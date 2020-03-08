/* eslint @typescript-eslint/no-non-null-assertion: "off" */

import React, { FunctionComponent } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RouteProps } from 'react-router';
import format from 'date-fns/format';
import { render, wait } from '@testing-library/react';
import 'mock-local-storage';

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
  await wait();
  const date = new Date();

  expect(app.findByText(format(date, 'MMMM yyyy'))).resolves.toBeTruthy();
  expect(location).toBeDefined();
  expect(location!.pathname).toBe(`/calendar/${format(date, 'yyyy-MM')}/`);
});
