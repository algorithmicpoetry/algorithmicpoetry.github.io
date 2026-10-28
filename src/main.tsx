import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

// Material Symbols for IconSymbol (no Expo vector-icons lock-in).
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0&display=swap';
document.head.appendChild(fontLink);

const rootTag = document.getElementById('root');
if (!rootTag) {
  throw new Error('Root element #root not found');
}

createRoot(rootTag).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
