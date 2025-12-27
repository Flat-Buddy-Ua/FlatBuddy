import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { MAIN } from './Components';
import { Theme } from '@twilio-paste/core/theme';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Theme.Provider theme="default"><MAIN /></Theme.Provider>, document.body);
registerServiceWorker();
