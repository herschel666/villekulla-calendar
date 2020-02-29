import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { API, graphqlOperation as gql } from 'aws-amplify';
import moment, { Moment } from 'moment';
import { TimePicker, DatePicker } from 'antd';

import { createCalendarEntry as CreateCalendarEntry } from '../../graphql/mutations';
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

((window as unknown) as { moment: typeof moment }).moment = moment;

const getinitialDate = (dateString: string | null): Moment =>
  moment(dateString || new Date(), 'YYYY-MM-DD');

export const CreateEventForm: React.FC<RouteComponentProps> = ({
  location: { search },
  history,
}) => {
  const query = new URLSearchParams(search);
  const initialDate = getinitialDate(query.get('date'));
  const [state, dispatch] = React.useReducer<typeof reducer>(
    reducer,
    getInitialState(initialDate)
  );
  const handleChange = (field: keyof FormState) => (
    evnt: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => dispatch(formAction(field, evnt.currentTarget.value.trim()));
  const handleDateTimeChange = (field: DateTimeFields) => (
    time: Moment | null
  ) => dispatch(dateTimeAction(field, time));
  const handleSubmit = async (evnt: React.SyntheticEvent) => {
    evnt.preventDefault();
    const { title, date, startTime, endTime, description } = state;

    if (!title || !date || !startTime || !endTime) {
      return;
    }

    dispatch(startRequest());
    const dateString = date.format('YYYY-MM-DD');
    const input = {
      creator: 'xfghfxghfxghdfghdxghxgxgb',
      title: title,
      start: `${dateString} ${startTime.format('HH:mm')}:00`,
      end: `${dateString} ${endTime.format('HH:mm')}:00`,
      description: description || null,
    };
    try {
      await API.graphql(gql(CreateCalendarEntry, { input }));
      history.push(`/calendar/${date.format('YYYY-MM')}/`);
    } catch (err) {
      console.log('error creating entry...', err);
      dispatch(endRequest());
    }
  };
  const handleReset = () => history.push('/');

  return (
    <form method="post" onSubmit={handleSubmit} onReset={handleReset}>
      <fieldset>
        <legend>Termin anlegen…</legend>
        <div>
          <label htmlFor="title">Titel</label>
          <input
            type="text"
            id="title"
            onInput={handleChange('title')}
            disabled={state.loading}
          />
        </div>
        <div>
          <label htmlFor="date">Datum</label>
          <DatePicker
            onChange={handleDateTimeChange('date')}
            format="DD.MM.YYYY"
            disabled={state.loading}
            defaultValue={state.date || void 0}
            value={state.date}
          />
        </div>
        <div>
          <label htmlFor="startTime">Uhrzeit (Start)</label>
          <TimePicker
            onChange={handleDateTimeChange('startTime')}
            format="HH:mm"
            minuteStep={15}
            disabled={state.loading}
            defaultValue={state.startTime || void 0}
            value={state.startTime}
          />
        </div>
        <div>
          <label htmlFor="endTime">Uhrzeit (Ende)</label>
          <TimePicker
            onChange={handleDateTimeChange('endTime')}
            format="HH:mm"
            minuteStep={15}
            disabled={state.loading}
            defaultValue={state.endTime || void 0}
            value={state.endTime}
          />
        </div>
        <div>
          <label htmlFor="description">Beschreibung</label>
          <textarea
            id="description"
            onInput={handleChange('description')}
            disabled={state.loading}
          ></textarea>
        </div>
      </fieldset>
      <button type="reset">Abbrechen</button>
      <button disabled={state.loading}>Absenden</button>
    </form>
  );
};
