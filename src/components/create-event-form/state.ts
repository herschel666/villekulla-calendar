import formatISO from 'date-fns/formatISO';
import add from 'date-fns/add';
import sub from 'date-fns/sub';
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

type Reducer = FormState & State;

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

type Action = StartRequest | EndRequest | FormAction | DateTimeAction;

export const getInitialState = (date: Date): Reducer => ({
  title: '',
  description: '',
  date,
  startTime: date,
  endTime: add(date, { hours: 1 }),
  loading: false,
});

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
      let { startTime, endTime } = state;

      if (
        action.payload.field === 'startTime' &&
        (isAfter(startTime, endTime) || isEqual(startTime, endTime))
      ) {
        endTime = add(startTime, { hours: 1 });
      }
      if (action.payload.field === 'endTime' && isBefore(endTime, startTime)) {
        startTime = sub(startTime, { hours: 1 });
      }
      if (
        action.payload.field === 'date' &&
        (!isSameDay(action.payload.value, startTime) ||
          !isSameDay(action.payload.value, endTime))
      ) {
        const dateString = formatISO(action.payload.value, {
          representation: 'date',
        });
        startTime = new Date(
          `${dateString}T${formatISO(startTime, { representation: 'time' })}`
        );
        endTime = new Date(
          `${dateString}T${formatISO(endTime, { representation: 'time' })}`
        );
      }

      return {
        ...state,
        endTime,
        startTime,
        [action.payload.field]: action.payload.value,
      };
    }
    default:
      return state;
  }
};
