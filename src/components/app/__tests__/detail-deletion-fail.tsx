/* eslint @typescript-eslint/no-non-null-assertion: "off" */

import React, { FunctionComponent } from 'react';
import { render, fireEvent, act, wait } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

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
  const { graphqlOperation } = jest.requireActual('aws-amplify');
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
    .mockResolvedValueOnce({
      errors: [{ errorType: 'DynamoDBDeletionError' }],
    });
  const API = { graphql };
  return { graphqlOperation, API };
});

let consoleError: Console['error'];

beforeAll(() => {
  consoleError = console.error;
  console.error = jest.fn();
});

afterAll(() => {
  console.error = consoleError;
});

it('logs the deletion error', async () => {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const { App } = require('..');
  const app = await render(
    <MemoryRouter initialEntries={['/detail/1/']}>
      <App />
    </MemoryRouter>
  );
  await wait();
  await wait();
  const btn = await app.getByText('Termin löschen');

  act(() => void fireEvent.click(btn));
  await wait();

  expect(console.error).toHaveBeenCalled();
});
