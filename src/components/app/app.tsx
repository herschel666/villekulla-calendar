import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import format from 'date-fns/format';

import { Calendar } from '../calendar';

export const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/(calendar/)?" exact={true}>
        <Redirect from="/" to={`/calendar/${format(new Date(), 'yyyy-MM')}/`} />
      </Route>
      <Route
        path="/calendar/:year([0-9]{4})-:month([0-9]{2})/"
        strict={true}
        exact={true}
        component={Calendar}
      />
      <Route path="*" render={() => <h1>Not found</h1>} />
    </Switch>
  </BrowserRouter>
);
