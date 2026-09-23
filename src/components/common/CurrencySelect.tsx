import { useCurrencyStore, type CurrencyCode } from '../../store/currencyStore';

const OPTIONS: CurrencyCode[] = ['USD', 'ZAR', 'EUR'];

export function CurrencySelect() {
  const code = useCurrencyStore((s) => s.code);
  const setCode = useCurrencyStore((s) => s.setCode);

  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-brand-600">
      <span className="sr-only">Currency</span>
      <select
        value={code}
        onChange={(e) => setCode(e.target.value as CurrencyCode)}
        className="h-8 px-2 border border-brand-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
        aria-label="Select currency"
      >
        {OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}
