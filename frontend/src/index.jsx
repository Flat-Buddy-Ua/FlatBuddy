import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RegisterLayout } from './pages/RegisterLayout';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <RegisterLayout />
  </React.StrictMode>
);
