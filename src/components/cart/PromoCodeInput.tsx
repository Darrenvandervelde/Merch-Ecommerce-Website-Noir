import { useState } from 'react';
import { usePromoStore } from '../../store/promoStore';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/format';
import { Tag, X } from 'lucide-react';

interface PromoCodeInputProps {
  subtotal: number;
}

export function PromoCodeInput({ subtotal }: PromoCodeInputProps) {
  const [input, setInput] = useState('');
  const applyCode = usePromoStore((s) => s.applyCode);
  const clearCode = usePromoStore((s) => s.clearCode);
  const applied = usePromoStore((s) => s.getAppliedPromo());
  const discount = usePromoStore((s) => s.getDiscountAmount(subtotal));
  const freeShip = usePromoStore((s) => s.isFreeShipping());
  const addToast = useToastStore((s) => s.addToast);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCode(input, subtotal);
    addToast(result.message, result.success ? 'success' : 'error');
    if (result.success) setInput('');
  };

  if (applied) {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Tag className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-emerald-900">
                {applied.code}
              </p>
              <p className="text-xs text-emerald-700">{applied.description}</p>
              {discount > 0 && (
                <p className="text-xs text-emerald-800 mt-0.5">
                  −{formatPrice(discount)} off subtotal
                </p>
              )}
              {freeShip && (
                <p className="text-xs text-emerald-800 mt-0.5">
                  Free shipping applied
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              clearCode();
              addToast('Promo code removed', 'info');
            }}
            className="text-emerald-700 hover:text-emerald-900 p-1"
            aria-label="Remove promo code"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase())}
        placeholder="Promo code"
        className="flex-1 h-10 px-3 border border-brand-300 rounded-md text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-brand-900"
        aria-label="Promo code"
        autoComplete="off"
      />
      <Button type="submit" size="sm" variant="outline">
        Apply
      </Button>
    </form>
  );
}
