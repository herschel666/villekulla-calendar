import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { API, graphqlOperation as gql } from 'aws-amplify';
import FullCalendar from '@fullcalendar/react';
import View from '@fullcalendar/core/View';
import { EventInput } from '@fullcalendar/core/structs/event';
import dayGridPlugin from '@fullcalendar/daygrid';
import format from 'date-fns/format';
import sub from 'date-fns/sub';
import add from 'date-fns/add';

import { createCalendarEntry as CreateCalendarEntry } from '../../graphql/mutations';
import { listCalendarEntrys as ListCalendarEntrys } from '../../graphql/queries';
import { CreateEventForm } from '../create-event-form';
import { FormState } from '../create-event-form/create-event-form';

interface DateClickArgs {
  date: Date;
  dateStr: string;
  allDay: boolean;
  resource?: unknown;
  dayEl: HTMLElement;
  jsEvent: MouseEvent;
  view: View;
}

interface Params {
  year: string;
  month: string;
}

type Props = RouteComponentProps<Params>;

const VIEW_TYPE = 'dayGridMonth';

export const Calendar: React.FC<Props> = ({ match: { params }, history }) => {
  const currentMonth = Object.values(params).join('-');
  const defaultDate = currentMonth.concat('-01');
  console.log('defaultDate', defaultDate);
  const customButtons = {
    navigationToday: {
      text: 'Heute',
      click: () => {
        history.push(`/calendar/${format(new Date(), 'yyyy-MM')}/`);
      },
    },
    navigationPrev: {
      text: '',
      icon: 'chevron-left',
      click: () => {
        const prev = sub(new Date(defaultDate), { months: 1 });
        history.push(`/calendar/${format(prev, 'yyyy-MM')}/`);
      },
    },
    navigationNext: {
      text: '',
      icon: 'chevron-right',
      click: () => {
        const next = add(new Date(defaultDate), { months: 1 });
        history.push(`/calendar/${format(next, 'yyyy-MM')}/`);
      },
    },
  };
  const header = {
    left: 'title',
    center: '',
    right: 'navigationToday navigationPrev navigationNext',
  };
  const calendarComponentRef = React.useRef<FullCalendar | null>(null);
  const [entries, setEntries] = React.useState<Array<unknown>>([]);
  const [date, setDate] = React.useState<string | null>(null);

  const handleDateClick = (args: DateClickArgs) => {
    setDate(format(args.date, 'yyyy-MM-dd'));
  };
  const loadEntries = React.useCallback(async () => {
    const { data } = await API.graphql(
      gql(ListCalendarEntrys, {
        filter: { start: { beginsWith: currentMonth } },
      })
    );

    setEntries(
      data.listCalendarEntrys.items.map(
        ({ title, start, end }: EventInput): EventInput => ({
          title,
          start,
          end,
          allDay: false,
        })
      )
    );
  }, [currentMonth]);
  const handleSubmit = async (args: FormState) => {
    const input = {
      creator: 'xfghfxghfxghdfghdxghxgxgb',
      title: args.title,
      start: `${date} ${args.startTime}`,
      end: `${date} ${args.endTime}`,
      description: args.description || null,
    };
    try {
      await API.graphql(gql(CreateCalendarEntry, { input }));
      loadEntries();
    } catch (err) {
      console.log('error creating entry...', err);
    }
  };

  React.useEffect(() => {
    loadEntries();
    if (calendarComponentRef.current) {
      calendarComponentRef.current.getApi().changeView(VIEW_TYPE, defaultDate);
    }
  }, [loadEntries, defaultDate]);

  return (
    <div>
      <FullCalendar
        ref={calendarComponentRef}
        dateClick={handleDateClick}
        eventClick={console.log}
        defaultView={VIEW_TYPE}
        plugins={[dayGridPlugin]}
        customButtons={customButtons}
        header={header}
        events={entries}
        defaultDate={defaultDate}
      />
      {Boolean(date) && (
        <>
          <hr />
          <CreateEventForm onSubmit={handleSubmit} />
        </>
      )}
    </div>
  );
};
