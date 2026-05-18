import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RegisterLayout } from './pages/RegisterLayout';
import { ErrorBoundary, installGlobalErrorHandlers } from './components/ErrorBoundary.jsx';

installGlobalErrorHandlers();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <RegisterLayout />
    </ErrorBoundary>
  </React.StrictMode>
);
