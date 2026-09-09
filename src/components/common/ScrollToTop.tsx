import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to top on every client-side route change. */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname, search]);

  return null;
}
