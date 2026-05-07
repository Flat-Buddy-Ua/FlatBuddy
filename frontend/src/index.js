import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { RegisterLayout } from './pages/RegisterLayout';
import { Theme } from '@twilio-paste/core/theme';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Theme.Provider theme="default"><RegisterLayout /></Theme.Provider>, document.body);
registerServiceWorker();
