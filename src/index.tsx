import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Amplify, { I18n } from '@aws-amplify/core';
import { withAuthenticator } from 'aws-amplify-react';

import config from './aws-exports';
import { App } from './components/app';
import './global.css';

const mount = document.getElementById('mount');
const Application = withAuthenticator(App);

Amplify.configure(config);
I18n.setLanguage('de');

render(
  <BrowserRouter>
    <Application mount={mount || undefined} />
  </BrowserRouter>,
  mount
);
