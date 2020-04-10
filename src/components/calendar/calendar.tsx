import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import View from '@fullcalendar/core/View';
import { EventApi } from '@fullcalendar/core/api/EventApi';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import format from 'date-fns/format';
import sub from 'date-fns/sub';
import add from 'date-fns/add';

import { useCalendarEntries } from '../../hooks/use-calendar-entries/';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const deLocale = require('@fullcalendar/core/locales/de');

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
  const entries = useCalendarEntries(currentMonth);

  const handleDateClick = (args: DateClickArgs) => {
    const dateString = format(new Date(args.date), 'yyyy-MM-dd');
    history.push(`/calendar/new/?date=${dateString}`);
  };
  const handleEventClick = ({ event }: { event: EventApi }) =>
    history.push(`/detail/${event.id}/`);

  React.useEffect(() => {
    if (calendarComponentRef.current) {
      calendarComponentRef.current.getApi().changeView(VIEW_TYPE, defaultDate);
    }
  }, [defaultDate]);

  return (
    <div data-testid="calendar">
      <FullCalendar
        ref={calendarComponentRef}
        locale={deLocale}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
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
