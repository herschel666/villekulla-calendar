import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import moment from 'moment';

import { Calendar } from '../calendar';
import { CreateEventForm } from '../create-event-form';

export const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/(calendar/)?" exact={true}>
        <Redirect from="/" to={`/calendar/${moment().format('YYYY-MM')}/`} />
      </Route>
      <Route
        path="/calendar/:year([0-9]{4})-:month([0-9]{2})/"
        strict={true}
        exact={true}
        component={Calendar}
      />
      <Route
        path="/calendar/new/"
        exact={true}
        strict={true}
        component={CreateEventForm}
      />
      <Route path="*" render={() => <h1>Not found</h1>} />
    </Switch>
  </BrowserRouter>
);
