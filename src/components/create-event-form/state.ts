import format from 'date-fns/format';
import add from 'date-fns/add';
import sub from 'date-fns/sub';
import set from 'date-fns/set';
import isEqual from 'date-fns/isEqual';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import isSameDay from 'date-fns/isSameDay';

export interface FormState {
  title: string;
  description: string;
  date: Date;
  startTime: Date;
  endTime: Date;
}
export type DateTimeFields = keyof Pick<
  FormState,
  'date' | 'startTime' | 'endTime'
>;

interface State {
  loading: boolean;
}

export type Reducer = FormState & State;

interface StartRequest {
  type: 'START_REQUEST';
}
const START_REQUEST = 'START_REQUEST';
export const startRequest = (): StartRequest => ({
  type: START_REQUEST,
});

interface EndRequest {
  type: 'END_REQUEST';
}
const END_REQUEST = 'END_REQUEST';
export const endRequest = (): EndRequest => ({
  type: END_REQUEST,
});

interface FormAction {
  type: 'FORM_ACTION';
  payload: {
    field: keyof FormState;
    value: string;
  };
}
const FORM_ACTION = 'FORM_ACTION';
export const formAction = (
  field: keyof FormState,
  value: string
): FormAction => ({
  type: FORM_ACTION,
  payload: { field, value },
});

interface DateTimeAction {
  type: 'DATE_TIME_ACTION';
  payload: {
    field: DateTimeFields;
    value: Date;
  };
}
const DATE_TIME_ACTION = 'DATE_TIME_ACTION';
export const dateTimeAction = (
  field: DateTimeFields,
  value: Date
): DateTimeAction => ({
  type: DATE_TIME_ACTION,
  payload: { field, value },
});

export type Action = StartRequest | EndRequest | FormAction | DateTimeAction;

export const getInitialState = (date: Date): Reducer => ({
  title: '',
  description: '',
  date,
  startTime: new Date(date),
  endTime: add(new Date(date), { hours: 1 }),
  loading: false,
});

const mergeTimeAndDate = (date: Date, time: Date): Date => {
  const hours = Number(format(time, 'HH'));
  const minutes = Number(format(time, 'mm'));
  return set(date, { hours, minutes });
};

export const reducer = (state: Reducer, action: Action): Reducer => {
  switch (action.type) {
    case START_REQUEST: {
      return { ...state, loading: true };
    }
    case END_REQUEST: {
      return { ...state, loading: false };
    }
    case FORM_ACTION: {
      return { ...state, [action.payload.field]: action.payload.value };
    }
    case DATE_TIME_ACTION: {
      const { field, value } = action.payload;
      let { startTime, endTime } = state;

      if (
        field === 'startTime' &&
        (isAfter(value, endTime) || isEqual(value, endTime))
      ) {
        endTime = add(value, { hours: 1 });
      }
      if (
        field === 'endTime' &&
        (isBefore(value, startTime) || isEqual(value, startTime))
      ) {
        startTime = sub(value, { hours: 1 });
      }
      if (field === 'date') {
        if (!isSameDay(value, startTime) || !isSameDay(value, endTime)) {
          startTime = mergeTimeAndDate(new Date(value), startTime);
          endTime = mergeTimeAndDate(new Date(value), endTime);
        }
      }

      return {
        ...state,
        endTime,
        startTime,
        [field]: value,
      };
    }
    default:
      return state;
  }
};
