import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** Resolved light/dark after system preference */
  resolved: 'light' | 'dark';
  apply: () => void;
}

function resolve(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return mode;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      resolved: 'light',
      setMode: (mode) => {
        set({ mode, resolved: resolve(mode) });
        get().apply();
      },
      apply: () => {
        const resolved = resolve(get().mode);
        set({ resolved });
        const root = document.documentElement;
        if (resolved === 'dark') {
          root.classList.add('dark');
          root.dataset.theme = 'dark';
        } else {
          root.classList.remove('dark');
          root.dataset.theme = 'light';
        }
      },
    }),
    {
      name: 'noir-theme-v1',
      partialize: (s) => ({ mode: s.mode }),
      onRehydrateStorage: () => (state) => {
        state?.apply();
      },
    }
  )
);
