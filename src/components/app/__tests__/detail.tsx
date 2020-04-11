/* eslint @typescript-eslint/no-non-null-assertion: "off" */

import React from 'react';
import format from 'date-fns/format';
import {
  render,
  fireEvent,
  findByText,
  queryByText,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RouteProps } from 'react-router';

jest.mock('../../../hooks/use-user', () => ({
  useUser: () => ({ username: 'test' }),
}));
jest.mock('@aws-amplify/api', () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const { graphqlOperation } = jest.requireActual('@aws-amplify/api');
  const item = {
    id: '1',
    title: 'My awesome event!',
    start: new Date(year, month, 18, 5, 30),
    end: new Date(year, month, 18, 8, 0),
    description: 'Lorem ipsum dolor.',
    creator: 'horst',
  };
  const graphql = jest
    .fn()
    .mockResolvedValueOnce({ data: { getCalendarEntry: item } });
  const API = { graphql };
  return { graphqlOperation, API };
});
jest.mock('../../../hooks/use-calendar-entries', () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  return {
    useCalendarEntries: () => [
      {
        id: '1',
        title: 'My awesome event!',
        start: new Date(year, month, 18, 5, 30),
        end: new Date(year, month, 18, 8, 0),
        description: 'Lorem ipsum dolor.',
        creator: 'horst',
      },
    ],
  };
});

it('displays the event details', async () => {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const { App } = require('..');
  let location: RouteProps['location'] | undefined;
  const mount = document.createElement('div');
  const title = 'My awesome event!';
  const date = new Date();
  const month = format(date, 'yyyy-MM');
  const app = render(
    <MemoryRouter initialEntries={[`/calendar/${month}/`]}>
      <App mount={mount} />
      <Route
        path="*"
        render={({ location: reactRouterLocation }) => {
          location = reactRouterLocation;
          return null;
        }}
      />
    </MemoryRouter>,
    { container: document.body.appendChild(mount) }
  );
  const entry = await app.findByText(title);
  fireEvent.click(entry!);

  expect(location!.pathname).toBe('/detail/1/');
  await findByText(document.body, 'My awesome event!', { selector: 'h2' });
  await findByText(
    document.body,
    format(new Date(date.getFullYear(), date.getMonth(), 18), 'dd.MM.yyyy')
  );
  await findByText(document.body, /05:30 Uhr bis 08:00 Uhr/);
  await findByText(document.body, 'Lorem ipsum dolor.');
  expect(await queryByText(document.body, 'Termin löschen')).toBe(null);
});
