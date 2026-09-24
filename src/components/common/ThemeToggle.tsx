import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore, type ThemeMode } from '../../store/themeStore';

const options: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: 'light', label: 'Light', icon: Sun },
  { mode: 'dark', label: 'Dark', icon: Moon },
  { mode: 'system', label: 'System', icon: Monitor },
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  if (compact) {
    const next: ThemeMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
    const Icon = mode === 'dark' ? Moon : mode === 'light' ? Sun : Monitor;
    return (
      <button
        type="button"
        onClick={() => setMode(next)}
        className="p-2 text-brand-700 hover:text-brand-950 dark:text-brand-300 dark:hover:text-white transition-colors"
        aria-label={`Theme: ${mode}. Click to switch.`}
        title={`Theme: ${mode}`}
      >
        <Icon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div
      className="inline-flex rounded-md border border-brand-300 dark:border-brand-600 p-0.5"
      role="group"
      aria-label="Colour theme"
    >
      {options.map(({ mode: m, label, icon: Icon }) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded ${
            mode === m
              ? 'bg-brand-900 text-white dark:bg-white dark:text-brand-950'
              : 'text-brand-600 hover:text-brand-900 dark:text-brand-400'
          }`}
          aria-pressed={mode === m}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
