import type { PrintSpecs } from '../../types';
import { formatPrice } from '../../utils/format';

interface PrintTimeEstimateProps {
  specs?: PrintSpecs;
  isPrint3d: boolean;
  stock: number;
  /** Optional unit price for material cost estimate */
  unitPrice?: number;
}

/** Rough material cost from weight (demo rates per gram). */
function estimateMaterialCost(weightGrams: number, material: string): number {
  const rate =
    material.toLowerCase().includes('petg')
      ? 0.08
      : material.toLowerCase().includes('resin')
        ? 0.12
        : 0.05; // PLA default
  return Math.round(weightGrams * rate * 100) / 100;
}

export function PrintTimeEstimate({
  specs,
  isPrint3d,
  stock,
  unitPrice,
}: PrintTimeEstimateProps) {
  const shipDays = stock > 10 ? '2–4' : stock > 0 ? '3–5' : '7–10';
  const printHours = specs?.printTimeHours;
  const weight = specs?.weightGrams;
  const materialCost =
    weight != null && specs?.material
      ? estimateMaterialCost(weight, specs.material)
      : null;

  return (
    <div className="mt-6 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm space-y-2">
      <p>
        <strong className="text-brand-900">Est. delivery:</strong>{' '}
        <span className="text-brand-600">{shipDays} business days</span>
        <span className="text-brand-400"> (ZA / international varies)</span>
      </p>

      {isPrint3d && printHours != null && (
        <>
          <p>
            <strong className="text-brand-900">Print queue:</strong>{' '}
            <span className="text-brand-600">
              ~{printHours}h machine time
              {stock < 5
                ? ' — low stock may add 1–2 days for a fresh print run'
                : ' — usually fulfilled from finished stock'}
            </span>
          </p>

          {weight != null && (
            <p>
              <strong className="text-brand-900">Material:</strong>{' '}
              <span className="text-brand-600">
                ~{weight}g {specs?.material ?? 'filament'}
                {materialCost != null && (
                  <> · est. filament cost {formatPrice(materialCost)}</>
                )}
              </span>
            </p>
          )}

          {specs && (
            <div className="pt-2 border-t border-brand-200 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-brand-500">
              <span>Layer: {specs.layerHeight}</span>
              <span>Infill: {specs.infill}</span>
              <span className="col-span-2">Size: {specs.dimensions}</span>
              {specs.eco && (
                <span className="col-span-2 text-emerald-700 font-medium">
                  Eco / recycled filament available
                </span>
              )}
            </div>
          )}

          {unitPrice != null && materialCost != null && (
            <p className="text-xs text-brand-400">
              List price {formatPrice(unitPrice)} includes labour, finishing &
              QC — not filament alone.
            </p>
          )}
        </>
      )}
    </div>
  );
}
