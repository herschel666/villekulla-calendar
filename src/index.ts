import React from 'react';
import { render } from 'react-dom';
import Amplify from 'aws-amplify';
import { locale } from 'moment';
import 'moment/locale/de';

import config from './aws-exports';
import { App } from './components/app';
import './global.css';

const mount = document.getElementById('mount');

locale('de');
Amplify.configure(config);
render(React.createElement(App), mount);
