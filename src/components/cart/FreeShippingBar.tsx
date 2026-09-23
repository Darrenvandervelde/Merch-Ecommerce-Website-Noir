import { Truck } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { cn } from '../../utils/cn';

const FREE_SHIPPING_THRESHOLD = 100;

interface FreeShippingBarProps {
  subtotal: number;
  className?: string;
}

/**
 * Motivates users to reach the free-shipping threshold ($100).
 */
export function FreeShippingBar({ subtotal, className }: FreeShippingBarProps) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const unlocked = remaining === 0;

  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3',
        unlocked
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-brand-200 bg-brand-50',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Truck
          className={cn(
            'h-5 w-5 shrink-0 mt-0.5',
            unlocked ? 'text-emerald-600' : 'text-brand-600'
          )}
        />
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-sm font-medium',
              unlocked ? 'text-emerald-900' : 'text-brand-900'
            )}
          >
            {unlocked
              ? 'You unlocked free shipping'
              : `You're ${formatPrice(remaining)} away from free shipping`}
          </p>
          <p className="mt-0.5 text-xs text-brand-500">
            Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
          </p>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-brand-200/80">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500 ease-out',
                unlocked ? 'bg-emerald-500' : 'bg-brand-900'
              )}
              style={{ width: `${progress}%` }}
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
              aria-label="Free shipping progress"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { FREE_SHIPPING_THRESHOLD };
