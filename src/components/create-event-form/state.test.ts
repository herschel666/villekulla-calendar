import format from 'date-fns/format';

import {
  reducer,
  startRequest,
  endRequest,
  formAction,
  dateTimeAction,
  Reducer,
  Action,
} from './state';

describe('create-event-form#state', () => {
  it('returns the passed state if action type is unknown', () => {
    const state = {} as Reducer;
    const result = reducer(state, ({ type: 'FOO' } as unknown) as Action);

    expect(result).toBe(state);
  });

  it('sets "loading: true" on type "START_REQUEST"', () => {
    const result = reducer({} as Reducer, startRequest());

    expect(result.loading).toBe(true);
  });

  it('sets "loading: false" on type "END_REQUEST"', () => {
    const result = reducer({} as Reducer, endRequest());

    expect(result.loading).toBe(false);
  });

  it('sets field value on type "FORM_ACTION#title"', () => {
    const field = 'title';
    const value = 'My nice event.';
    const result = reducer({} as Reducer, formAction(field, value));

    expect(result[field]).toBe(value);
  });

  it('sets field value on type "FORM_ACTION#description"', () => {
    const field = 'description';
    const value = 'This event will be awesomesauce!!1';
    const result = reducer({} as Reducer, formAction(field, value));

    expect(result[field]).toBe(value);
  });

  describe('DATE_TIME_ACTION#date', () => {
    const field = 'date';

    it('sets the value', () => {
      const value = new Date(Date.UTC(2020, 3, 10, 13, 36, 0));
      const state = {
        startTime: new Date(Date.UTC(2020, 3, 10, 8, 0, 0)),
        endTime: new Date(Date.UTC(2020, 3, 10, 9, 30, 0)),
      };
      const result = reducer(state as Reducer, dateTimeAction(field, value));

      expect(result[field].toUTCString()).toBe('Fri, 10 Apr 2020 13:36:00 GMT');
    });

    it('updates the value', () => {
      const value = new Date(Date.UTC(2020, 3, 10, 13, 36, 0));
      const state = {
        date: new Date(Date.UTC(2020, 3, 8, 13, 36, 0)),
        startTime: new Date(Date.UTC(2020, 3, 10, 8, 0, 0)),
        endTime: new Date(Date.UTC(2020, 3, 10, 9, 30, 0)),
      };
      const result = reducer(state as Reducer, dateTimeAction(field, value));

      expect(result[field].toUTCString()).toBe('Fri, 10 Apr 2020 13:36:00 GMT');
    });

    it('sets start- & endtime to the current day on single-day events', () => {
      const value = new Date(Date.UTC(2020, 3, 10, 13, 36, 0));
      const state = {
        startTime: new Date(Date.UTC(2020, 2, 9, 8, 0, 0)),
        endTime: new Date(Date.UTC(2020, 4, 11, 9, 30, 0)),
      };
      const result = reducer(state as Reducer, dateTimeAction(field, value));

      expect(result[field].toUTCString()).toBe('Fri, 10 Apr 2020 13:36:00 GMT');
      expect(format(result.startTime, 'yyyy-MM-dd')).toBe('2020-04-10');
      expect(format(result.endTime, 'yyyy-MM-dd')).toBe('2020-04-10');
    });
  });

  describe('DATE_TIME_ACTION#startTime', () => {
    const field = 'startTime';

    it('sets the value', () => {
      const value = new Date(Date.UTC(2020, 3, 10, 13, 30, 0));
      const state = {
        endTime: new Date(Date.UTC(2020, 3, 10, 14, 30, 0)),
      };
      const result = reducer(state as Reducer, dateTimeAction(field, value));

      expect(result[field].toUTCString()).toBe('Fri, 10 Apr 2020 13:30:00 GMT');
    });

    it('updates the endtime to have an one-hour interval when equal', () => {
      const value = new Date(Date.UTC(2020, 3, 10, 13, 30, 0));
      const state = {
        endTime: new Date(Date.UTC(2020, 3, 10, 13, 30, 0)),
      };
      const result = reducer(state as Reducer, dateTimeAction(field, value));

      expect(result[field].toUTCString()).toBe('Fri, 10 Apr 2020 13:30:00 GMT');
      expect(result.endTime.toUTCString()).toBe(
        'Fri, 10 Apr 2020 14:30:00 GMT'
      );
    });

    it('updates the endtime to have an one-hour interval when later', () => {
      const value = new Date(Date.UTC(2020, 3, 10, 14, 0, 0));
      const state = {
        endTime: new Date(Date.UTC(2020, 3, 10, 13, 30, 0)),
      };
      const result = reducer(state as Reducer, dateTimeAction(field, value));

      expect(result[field].toUTCString()).toBe('Fri, 10 Apr 2020 14:00:00 GMT');
      expect(result.endTime.toUTCString()).toBe(
        'Fri, 10 Apr 2020 15:00:00 GMT'
      );
    });
  });

  describe('DATE_TIME_ACTION#endTime', () => {
    const field = 'endTime';

    it('sets the value', () => {
      const value = new Date(Date.UTC(2020, 3, 10, 15, 0, 0));
      const state = {
        startTime: new Date(Date.UTC(2020, 3, 10, 14, 30, 0)),
      };
      const result = reducer(state as Reducer, dateTimeAction(field, value));

      expect(result[field].toUTCString()).toBe('Fri, 10 Apr 2020 15:00:00 GMT');
    });

    it('updates the startTime to have an one-hour interval when equal', () => {
      const value = new Date(Date.UTC(2020, 3, 10, 13, 30, 0));
      const state = {
        startTime: new Date(Date.UTC(2020, 3, 10, 13, 30, 0)),
      };
      const result = reducer(state as Reducer, dateTimeAction(field, value));

      expect(result[field].toUTCString()).toBe('Fri, 10 Apr 2020 13:30:00 GMT');
      expect(result.startTime.toUTCString()).toBe(
        'Fri, 10 Apr 2020 12:30:00 GMT'
      );
    });

    it('updates the startTime to have an one-hour interval when earlier', () => {
      const value = new Date(Date.UTC(2020, 3, 10, 12, 0, 0));
      const state = {
        startTime: new Date(Date.UTC(2020, 3, 10, 13, 30, 0)),
      };
      const result = reducer(state as Reducer, dateTimeAction(field, value));

      expect(result[field].toUTCString()).toBe('Fri, 10 Apr 2020 12:00:00 GMT');
      expect(result.startTime.toUTCString()).toBe(
        'Fri, 10 Apr 2020 11:00:00 GMT'
      );
    });
  });
});
