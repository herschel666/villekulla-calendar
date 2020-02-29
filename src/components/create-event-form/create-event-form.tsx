import React from 'react';

export interface FormState {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface State {
  loading: boolean;
}

type Reducer = FormState & State;

interface StartRequest {
  type: 'START_REQUEST';
}
const START_REQUEST = 'START_REQUEST';
const startRequest = (): StartRequest => ({
  type: START_REQUEST,
});

interface EndRequest {
  type: 'END_REQUEST';
}
const END_REQUEST = 'END_REQUEST';
const endRequest = (): EndRequest => ({
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
const formAction = (field: keyof FormState, value: string): FormAction => ({
  type: FORM_ACTION,
  payload: { field, value },
});

type Action = StartRequest | EndRequest | FormAction;

interface Props {
  onSubmit: (args: FormState) => Promise<void>;
}

const initialState: Reducer = {
  title: '',
  description: '',
  startTime: '',
  endTime: '',
  loading: false,
};

const reducer = (state: Reducer, action: Action): Reducer => {
  switch (action.type) {
    case START_REQUEST: {
      return { ...state, loading: true };
    }
    case END_REQUEST: {
      return { ...initialState };
    }
    case FORM_ACTION: {
      return { ...state, [action.payload.field]: action.payload.value };
    }
    default:
      return state;
  }
};

export const CreateEventForm: React.FC<Props> = ({ onSubmit }) => {
  const [state, dispatch] = React.useReducer<typeof reducer>(
    reducer,
    initialState
  );
  const handleChange = (field: keyof FormState) => (
    evnt: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => dispatch(formAction(field, evnt.currentTarget.value.trim()));
  const handleSubmit = async (evnt: React.SyntheticEvent) => {
    evnt.preventDefault();
    dispatch(startRequest());
    // eslint-disable-next-line no-unused-vars
    const { loading, ...formState } = state;
    await onSubmit(formState as FormState);
    dispatch(endRequest());
  };

  return (
    <form method="post" onSubmit={handleSubmit}>
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
          <label htmlFor="startTime">Uhrzeit (Start)</label>
          <input
            type="text"
            id="startTime"
            onInput={handleChange('startTime')}
            disabled={state.loading}
          />
        </div>
        <div>
          <label htmlFor="endTime">Uhrzeit (Ende)</label>
          <input
            type="text"
            id="endTime"
            onInput={handleChange('endTime')}
            disabled={state.loading}
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
      <button disabled={state.loading}>Absenden</button>
    </form>
  );
};
