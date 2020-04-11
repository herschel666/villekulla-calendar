/* eslint @typescript-eslint/no-non-null-assertion: "off" */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import wait from 'waait';

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
  const app = render(
    <MemoryRouter initialEntries={['/detail/1/']}>
      <App />
    </MemoryRouter>
  );
  const btn = await app.findByText('Termin löschen');

  fireEvent.click(btn);
  await wait();

  expect(console.error).toHaveBeenCalled();
});
