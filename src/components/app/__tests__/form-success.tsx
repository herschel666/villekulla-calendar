/* eslint @typescript-eslint/no-non-null-assertion: "off" */

import React, { FunctionComponent } from 'react';
import { MemoryRouter } from 'react-router-dom';
import format from 'date-fns/format';
import { render, fireEvent } from '@testing-library/react';

jest.mock('react-router-dom', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createElement, Fragment, Children } = require('react');
  const mod = jest.requireActual('react-router-dom');
  const BrowserRouter: FunctionComponent = ({ children }) =>
    createElement(Fragment, void 0, Children.only(children));
  return { ...mod, BrowserRouter };
});
jest.mock('../../../hooks/use-user', () => ({
  useUser: () => ({ username: 'test' }),
}));
jest.mock('@aws-amplify/api', () => {
  const { graphqlOperation } = jest.requireActual('@aws-amplify/api');
  const graphql = jest.fn().mockResolvedValueOnce({});
  const API = { graphql };
  return { graphqlOperation, API };
});
jest.mock('../../../hooks/use-calendar-entries', () => {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const formatISO = require('date-fns/formatISO');
  const mockDate = new Date();
  const eventStartDate = new Date(mockDate);
  const eventEndDate = new Date(mockDate);

  return {
    useCalendarEntries: () => [
      {
        title: 'My nice event',
        start: formatISO(eventStartDate),
        end: formatISO(eventEndDate),
        description: 'This will be fun!',
      },
    ],
  };
});

it('should be possible to create an event', async () => {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const { App } = require('..');
  const eventTitle = 'My nice event';
  const evnt = (value: string) => ({ target: { value } });
  const date = new Date();
  const month = format(date, 'yyyy-MM');
  const app = render(
    <MemoryRouter initialEntries={[`/calendar/new/?date=${month}-28`]}>
      <App />
    </MemoryRouter>
  );
  await app.findByText('Termin anlegen…');

  const title = app.getByLabelText('Titel');
  const startTime = app.getByLabelText('Uhrzeit (Start)');
  const endTime = app.getByLabelText('Uhrzeit (Ende)');
  const description = app.getByLabelText('Beschreibung');
  const form = app.container.querySelector('form')!;

  fireEvent.change(title, evnt(eventTitle));
  fireEvent.change(startTime, evnt('11:00'));
  fireEvent.change(endTime, evnt('13:30'));
  fireEvent.change(description, evnt('This will be fun!'));
  fireEvent.submit(form);

  await app.findByText(eventTitle);
});
