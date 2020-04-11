import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { Location } from 'history';
import format from 'date-fns/format';

import { Calendar } from '../calendar';
import { CreateEventForm, CreateEventFormModal } from '../create-event-form';
import { EventDetailModal, EventDetail } from '../event-detail';

interface Props {
  mount: HTMLElement | undefined;
}

interface LocationState {
  eventCreation?: Location;
  eventDetail?: Location;
}

export const App: React.FC<Props> = ({ mount }) => {
  const location = useLocation<LocationState>();
  const eventCreation = location.state?.eventCreation;
  const eventDetail = location.state?.eventDetail;

  return (
    <>
      <Switch location={eventCreation || eventDetail || location}>
        <Route path="/(calendar/)?" exact={true}>
          <Redirect
            from="/"
            to={`/calendar/${format(new Date(), 'yyyy-MM')}/`}
          />
        </Route>
        <Route
          path="/calendar/:year([0-9]{4})-:month([0-9]{2})/"
          strict={true}
          exact={true}
        >
          <Calendar inBackground={Boolean(eventCreation || eventDetail)} />
        </Route>
        <Route
          path="/calendar/new/"
          exact={true}
          strict={true}
          component={CreateEventForm}
        />
        <Route
          path="/detail/:eventId/"
          exact={true}
          strict={true}
          component={EventDetail}
        />
        <Route path="*" render={() => <h1>Not found</h1>} />
      </Switch>
      {eventCreation && (
        <Route path="/calendar/new/" exact={true} strict={true}>
          <CreateEventFormModal
            appElement={mount}
            pathToLastView={eventCreation.pathname}
          />
        </Route>
      )}
      {eventDetail && (
        <Route path="/detail/:eventId/" exact={true} strict={true}>
          <EventDetailModal
            appElement={mount}
            pathToLastView={eventDetail.pathname}
          />
        </Route>
      )}
    </>
  );
};
