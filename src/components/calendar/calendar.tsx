import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { API, graphqlOperation as gql } from 'aws-amplify';
import FullCalendar from '@fullcalendar/react';
import View from '@fullcalendar/core/View';
import { EventInput } from '@fullcalendar/core/structs/event';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

import { listCalendarEntrys as ListCalendarEntrys } from '../../graphql/queries';

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
  const customButtons = {
    navigationToday: {
      text: 'Heute',
      click: () => {
        history.push(`/calendar/${moment().format('YYYY-MM')}/`);
      },
    },
    navigationPrev: {
      text: '',
      icon: 'chevron-left',
      click: () => {
        const date = moment(new Date(defaultDate))
          .subtract(1, 'months')
          .format('YYYY-MM');
        history.push(`/calendar/${date}/`);
      },
    },
    navigationNext: {
      text: '',
      icon: 'chevron-right',
      click: () => {
        const date = moment(new Date(defaultDate))
          .add(1, 'months')
          .format('YYYY-MM');
        history.push(`/calendar/${date}/`);
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

  const handleDateClick = (args: DateClickArgs) => {
    const dateString = moment(args.date).format('YYYY-MM-DD');
    history.push(`/calendar/new/?date=${dateString}`);
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
        plugins={[dayGridPlugin, interactionPlugin]}
        customButtons={customButtons}
        header={header}
        events={entries}
        defaultDate={defaultDate}
      />
    </div>
  );
};
