import { Printer } from 'lucide-react';

interface MadeToOrderBadgeProps {
  /** Lead time in business days after print starts */
  leadDays?: number;
  lowStock?: boolean;
}

/**
 * Trust signal for print-on-demand / low-stock 3D items.
 */
export function MadeToOrderBadge({
  leadDays = 5,
  lowStock = false,
}: MadeToOrderBadgeProps) {
  const shipLabel = lowStock
    ? `Made to order · ships in ${leadDays + 2}–${leadDays + 4} business days`
    : `Made to order · typically ships in ${leadDays}–${leadDays + 2} business days`;

  return (
    <div className="inline-flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm">
      <Printer className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" aria-hidden />
      <div>
        <p className="font-semibold text-emerald-900">Made to order</p>
        <p className="text-xs text-emerald-800/80 mt-0.5">{shipLabel}</p>
      </div>
    </div>
  );
}
