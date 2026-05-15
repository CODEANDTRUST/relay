import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RelayApp } from './RelayApp';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RelayApp />
  </StrictMode>,
);
