import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-update
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] New content available; updating cache.');
  },
  onOfflineReady() {
    console.log('[PWA] Finora is precached and ready for offline use.');
  },
  onRegisterError(error) {
    console.error('[PWA] Service worker registration failed:', error);
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
