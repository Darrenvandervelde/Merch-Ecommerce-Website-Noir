import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

const RELOAD_KEY = 'noir-chunk-reload';

/**
 * True when a dynamic import failed because the chunk file is missing/stale
 * (common after a new Vercel deploy while the tab still has old HTML).
 */
export function isChunkLoadError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? '');
  return (
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    /Loading chunk \d+ failed/i.test(msg) ||
    /ChunkLoadError/i.test(msg)
  );
}

/** One hard reload after a chunk miss so the browser picks up new asset hashes. */
export function reloadOnceForChunkError(): void {
  try {
    if (sessionStorage.getItem(RELOAD_KEY) === '1') {
      sessionStorage.removeItem(RELOAD_KEY);
      return;
    }
    sessionStorage.setItem(RELOAD_KEY, '1');
  } catch {
    /* private mode */
  }
  window.location.reload();
}

/**
 * lazy() with one automatic reload when the chunk 404s / returns HTML after deploy.
 */
export function lazyWithRetry<
  T extends ComponentType<unknown>
>(factory: () => Promise<{ default: T }>): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      const mod = await factory();
      try {
        sessionStorage.removeItem(RELOAD_KEY);
      } catch {
        /* ignore */
      }
      return mod;
    } catch (err) {
      if (isChunkLoadError(err)) {
        reloadOnceForChunkError();
      }
      throw err;
    }
  });
}
