import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { API, graphqlOperation as gql } from '@aws-amplify/api';
import format from 'date-fns/format';
import formatISO from 'date-fns/formatISO';
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes';
import isDate from 'date-fns/isDate';
import isValid from 'date-fns/isValid';
import de from 'date-fns/locale/de';
import 'react-datepicker/dist/react-datepicker.css';

import { createCalendarEntry as CreateCalendarEntry } from '../../graphql/mutations';
import { useUser } from '../../hooks/use-user';
import { useClientId } from '../../hooks/use-client-id/';
import {
  reducer,
  startRequest,
  endRequest,
  formAction,
  dateTimeAction,
  getInitialState,
  FormState,
  DateTimeFields,
} from './state';

const getinitialDate = (dateString: string | null): Date => {
  const now = new Date();
  const date = dateString
    ? new Date(`${dateString}T${formatISO(now, { representation: 'time' })}`)
    : now;
  const isValidDate = isDate(date) && isValid(date);
  return roundToNearestMinutes(isValidDate ? date : now, { nearestTo: 15 });
};

export const CreateEventForm: React.FC<RouteComponentProps> = ({
  location: { search },
  history,
}) => {
  const user = useUser();
  const query = new URLSearchParams(search);
  const initialDate = getinitialDate(query.get('date'));
  const clientId = useClientId();
  const [state, dispatch] = React.useReducer<typeof reducer>(
    reducer,
    getInitialState(initialDate)
  );
  const handleChange = (field: keyof FormState) => (
    evnt: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => dispatch(formAction(field, evnt.currentTarget.value.trim()));
  const handleDateTimeChange = (field: DateTimeFields) => (time: Date) =>
    dispatch(dateTimeAction(field, time));
  const handleSubmit = async (evnt: React.SyntheticEvent) => {
    evnt.preventDefault();
    const { title, startTime, endTime, description } = state;

    if (!clientId || !user || !title || !startTime || !endTime) {
      return;
    }

    dispatch(startRequest());
    const input = {
      clientId,
      creator: user.username,
      calendar: 'COMMON_ROOM',
      title: title,
      start: formatISO(startTime),
      end: formatISO(endTime),
      description: description || null,
    };
    try {
      await API.graphql(gql(CreateCalendarEntry, { input }));
      history.push(`/calendar/${format(startTime, 'yyyy-MM')}/`);
    } catch (err) {
      console.log('error creating entry...', err);
      dispatch(endRequest());
    }
  };
  const handleReset = () => history.push('/');

  return (
    <form method="post" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Termin anlegen…</legend>
        <div>
          <label htmlFor="title">Titel</label>
          <input
            type="text"
            id="title"
            onChange={handleChange('title')}
            disabled={state.loading}
            required={true}
          />
        </div>
        <div>
          <label id="date">Datum</label>
          <DatePicker
            ariaLabelledBy="date"
            onChange={handleDateTimeChange('date')}
            disabled={state.loading}
            selected={state.date}
            minDate={new Date()}
            dateFormat="d. MMMM yyyy"
            locale={de}
            required={true}
          />
        </div>
        <div>
          <label id="startTime">Uhrzeit (Start)</label>
          <DatePicker
            ariaLabelledBy="startTime"
            onChange={handleDateTimeChange('startTime')}
            showTimeSelect={true}
            showTimeSelectOnly={true}
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="HH:mm"
            disabled={state.loading}
            selected={state.startTime}
            locale={de}
            required={true}
          />
        </div>
        <div>
          <label id="endTime">Uhrzeit (Ende)</label>
          <DatePicker
            ariaLabelledBy="endTime"
            onChange={handleDateTimeChange('endTime')}
            showTimeSelect={true}
            showTimeSelectOnly={true}
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="HH:mm"
            disabled={state.loading}
            selected={state.endTime}
            locale={de}
            required={true}
          />
        </div>
        <div>
          <label htmlFor="description">Beschreibung</label>
          <textarea
            id="description"
            onChange={handleChange('description')}
            disabled={state.loading}
          ></textarea>
        </div>
      </fieldset>
      <button type="reset" onClick={handleReset}>
        Abbrechen
      </button>
      <button disabled={state.loading}>Absenden</button>
    </form>
  );
};
