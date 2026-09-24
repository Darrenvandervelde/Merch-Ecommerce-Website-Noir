import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useThemeStore } from './store/themeStore';
import './index.css';

// Apply saved theme before first paint of routes
useThemeStore.getState().apply();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>
);
