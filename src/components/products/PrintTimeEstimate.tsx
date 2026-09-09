import type { PrintSpecs } from '../../types';

interface PrintTimeEstimateProps {
  specs?: PrintSpecs;
  isPrint3d: boolean;
  stock: number;
}

export function PrintTimeEstimate({
  specs,
  isPrint3d,
  stock,
}: PrintTimeEstimateProps) {
  const shipDays = stock > 10 ? '2–4' : stock > 0 ? '3–5' : '7–10';
  const printHours = specs?.printTimeHours;

  return (
    <div className="mt-6 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm space-y-1.5">
      <p>
        <strong className="text-brand-900">Est. delivery:</strong>{' '}
        <span className="text-brand-600">{shipDays} business days</span>
        <span className="text-brand-400"> (ZA / international varies)</span>
      </p>
      {isPrint3d && printHours != null && (
        <p>
          <strong className="text-brand-900">Print queue:</strong>{' '}
          <span className="text-brand-600">
            ~{printHours}h machine time
            {stock < 5
              ? ' — low stock may add 1–2 days for a fresh print run'
              : ' — usually fulfilled from finished stock'}
          </span>
        </p>
      )}
    </div>
  );
}
