import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useRegisterSW } from './hooks/useRegisterSW';
import './index.css';

function Root() {
  useRegisterSW();
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
