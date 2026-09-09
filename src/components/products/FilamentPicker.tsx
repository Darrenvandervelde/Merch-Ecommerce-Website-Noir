import type { FilamentOption } from '../../types';
import { cn } from '../../utils/cn';

interface FilamentPickerProps {
  options: FilamentOption[];
  value: string;
  onChange: (name: string, hex: string) => void;
}

export function FilamentPicker({ options, value, onChange }: FilamentPickerProps) {
  return (
    <div>
      <p className="text-sm font-medium text-brand-900 mb-3">
        Filament / finish:{' '}
        <span className="font-normal text-brand-600">{value || 'Select'}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const active = value === opt.name;
          return (
            <button
              key={opt.name}
              type="button"
              onClick={() => onChange(opt.name, opt.hex)}
              className={cn(
                'group flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all',
                active
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'border-brand-200 hover:border-brand-400'
              )}
              title={opt.finish ? `${opt.name} · ${opt.finish}` : opt.name}
            >
              <span
                className="h-10 w-10 rounded-full border border-black/10 shadow-inner"
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
