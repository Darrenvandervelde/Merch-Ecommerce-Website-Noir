import type { FilamentOption } from '../../types';
import { cn } from '../../utils/cn';

interface FilamentPickerProps {
  options: FilamentOption[];
  value: string;
  onChange: (name: string, hex: string) => void;
}

export function FilamentPicker({ options, value, onChange }: FilamentPickerProps) {
  const selected = options.find((o) => o.name === value);

  return (
    <div>
      <p className="text-sm font-medium text-brand-900 mb-3">
        Filament / finish:{' '}
        <span className="font-normal text-brand-600">{value || 'Select'}</span>
      </p>

      {/* Live material preview */}
      {selected && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg border border-brand-200 p-3"
          aria-live="polite"
        >
          <span
            className="h-12 w-12 rounded-full border border-black/10 shadow-lg ring-2 ring-offset-2 ring-brand-300"
            style={{
              backgroundColor: selected.hex,
              boxShadow: `inset 0 2px 8px rgba(255,255,255,0.25), 0 4px 12px ${selected.hex}55`,
            }}
          />
          <div className="text-sm">
            <p className="font-semibold text-brand-900">{selected.name}</p>
            {selected.finish && (
              <p className="text-brand-500">{selected.finish} finish</p>
            )}
            <p className="text-xs text-brand-400 mt-0.5">
              Live preview updates the 3D model colour
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3" role="listbox" aria-label="Filament options">
        {options.map((opt) => {
          const active = value === opt.name;
          return (
            <button
              key={opt.name}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onChange(opt.name, opt.hex)}
              className={cn(
                'group flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all',
                active
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-105'
                  : 'border-brand-200 hover:border-brand-400 hover:scale-[1.02]'
              )}
              title={opt.finish ? `${opt.name} · ${opt.finish}` : opt.name}
            >
              <span
                className="h-10 w-10 rounded-full border border-black/10 shadow-inner transition-transform group-hover:scale-110"
                style={{ backgroundColor: opt.hex }}
              />
              <span className="text-[10px] font-medium text-brand-700 max-w-[72px] truncate">
                {opt.name}
              </span>
              {opt.finish && (
                <span className="text-[9px] text-brand-400">{opt.finish}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
