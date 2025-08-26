import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/main.scss'; // Sass File Import

// PWA registration (from vite-plugin-pwa)
import { registerSW } from 'virtual:pwa-register';

// This will register the service worker immediately
registerSW({ immediate: true });

// ✅ Use ReactDOM.createRoot (no need for duplicate createRoot call)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
