import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeAnalytics } from './services/analytics';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('requestIdleCallback' in window) window.requestIdleCallback(() => initializeAnalytics());
else setTimeout(initializeAnalytics, 1000);
