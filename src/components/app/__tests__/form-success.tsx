/* eslint @typescript-eslint/no-non-null-assertion: "off" */

import React, { FunctionComponent } from 'react';
import { MemoryRouter } from 'react-router-dom';
import format from 'date-fns/format';
import { render, fireEvent, wait as waitFor } from '@testing-library/react';

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
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const formatISO = require('date-fns/formatISO');
  const { graphqlOperation } = jest.requireActual('aws-amplify');
  const mockDate = new Date();
  const eventStartDate = new Date(mockDate);
  const eventEndDate = new Date(mockDate);
  eventStartDate.setHours(11);
  eventStartDate.setMinutes(0);
  eventEndDate.setHours(13);
  eventEndDate.setMinutes(30);
  const graphql = jest
    .fn()
    .mockResolvedValueOnce({})
    .mockResolvedValueOnce({
      data: {
        listCalendarEntrys: {
          items: [
            {
              title: 'My nice event',
              start: formatISO(eventStartDate),
              end: formatISO(eventEndDate),
              description: 'This will be fun!',
            },
          ],
        },
      },
    });
  const API = { graphql };
  return { graphqlOperation, API };
});

it('should be possible to create an event', async () => {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const { App } = require('..');
  const eventTitle = 'My nice event';
  const evnt = (value: string) => ({ target: { value } });
  const date = new Date();
  const month = format(date, 'yyyy-MM');
  const app = await render(
    <MemoryRouter initialEntries={[`/calendar/new/?date=${month}-28`]}>
      <App />
    </MemoryRouter>
  );

  const title = await app.getByLabelText('Titel');
  const startTime = await app.getByLabelText('Uhrzeit (Start)');
  const endTime = await app.getByLabelText('Uhrzeit (Ende)');
  const description = await app.getByLabelText('Beschreibung');
  const form = app.container.querySelector('form')!;

  fireEvent.change(title, evnt(eventTitle));
  fireEvent.change(startTime, evnt('11:00'));
  fireEvent.change(endTime, evnt('13:30'));
  fireEvent.change(description, evnt('This will be fun!'));
  fireEvent.submit(form);

  await waitFor(() => app.getByText(eventTitle));
});
