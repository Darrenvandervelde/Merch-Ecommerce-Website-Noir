import { useEffect, useState } from 'react';
import { checkApiHealth } from '../api/client';

export function useApiStatus() {
  const [status, setStatus] = useState<{
    online: boolean;
    baseURL: string;
    message: string;
    loading: boolean;
  }>({
    online: false,
    baseURL: '',
    message: 'Checking…',
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    checkApiHealth().then((r) => {
      if (!cancelled) setStatus({ ...r, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
