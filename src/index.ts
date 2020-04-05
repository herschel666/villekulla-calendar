import React from 'react';
import { render } from 'react-dom';
import Amplify, { I18n } from '@aws-amplify/core';
import { withAuthenticator } from 'aws-amplify-react';

import config from './aws-exports';
import { App } from './components/app';
import './global.css';

const Application = withAuthenticator(App);
const mount = document.getElementById('mount');

Amplify.configure(config);
I18n.setLanguage('de');

render(React.createElement(Application), mount);
