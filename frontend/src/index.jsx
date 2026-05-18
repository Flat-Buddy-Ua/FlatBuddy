import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RegisterLayout } from './pages/RegisterLayout';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { DebugPanel } from './components/DebugPanel.jsx';
import { installInterceptors } from './utils/errorBus.js';

installInterceptors();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <RegisterLayout />
    </ErrorBoundary>
    <DebugPanel />
  </React.StrictMode>
);
