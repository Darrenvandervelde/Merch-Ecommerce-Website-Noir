import { useEffect } from 'react';

/** Registers the service worker when available (production / HTTPS). */
export function useRegisterSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    // Avoid noisy failures on localhost http without flags
    const register = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => {
          /* silent — SW optional for demo */
        });
    };
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register);
    return () => window.removeEventListener('load', register);
  }, []);
}
