import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import { Button } from '../common/Button';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import { cn } from '../../utils/cn';
import { Check, Package } from 'lucide-react';

interface BundleBuilderProps {
  current: Product;
  catalog: Product[];
  /** Discount when 2+ items selected (default 10%) */
  bundlePercent?: number;
}

/**
 * Multi-select "Build your set" — pick partners from bundleWith + related catalog,
 * see live savings, add all to cart in one click.
 */
export function BundleBuilder({
  current,
  catalog,
  bundlePercent = 10,
}: BundleBuilderProps) {
  const partnerIds = current.bundleWith ?? [];
  const partners = useMemo(() => {
    const fromBundle = catalog.filter((p) => partnerIds.includes(p.id));
    // Fallback: same category, different product, up to 4
    if (fromBundle.length > 0) return fromBundle;
    return catalog
      .filter((p) => p.id !== current.id && p.category === current.category)
      .slice(0, 4);
  }, [catalog, partnerIds, current]);

  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  if (partners.length === 0) return null;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const unitPrice = (p: Product) => p.salePrice ?? p.price;
  const currentUnit = unitPrice(current);
  const selectedProducts = partners.filter((p) => selected.has(p.id));
  const separate =
    currentUnit +
    selectedProducts.reduce((sum, p) => sum + unitPrice(p), 0);
  const itemCount = 1 + selectedProducts.length;
  const discountRate = itemCount >= 2 ? bundlePercent / 100 : 0;
  const bundleTotal = Math.round(separate * (1 - discountRate) * 100) / 100;
  const save = separate - bundleTotal;

  const addBundle = () => {
    if (selectedProducts.length === 0) {
      addToast('Select at least one item to build a set.', 'info');
      return;
    }

    const colourA = current.filaments?.[0]?.name ?? current.colours[0] ?? '';
    const sizeA = current.sizes[0] ?? '';
    const results = [
      addItem(current, colourA, sizeA, 1),
      ...selectedProducts.map((p) => {
        const c = p.filaments?.[0]?.name ?? p.colours[0] ?? '';
        const s = p.sizes[0] ?? '';
        return addItem(p, c, s, 1);
      }),
    ];

    const allOk = results.every((r) => r.success);
    if (allOk) {
      addToast(
        `Set added (${itemCount} items)${
          save > 0 ? ` — save ${formatPrice(save)}` : ''
        }`,
        'success'
      );
      setSelected(new Set());
    } else {
      const fail = results.find((r) => !r.success);
      addToast(fail?.message ?? 'Could not add set', 'error');
    }
  };

  return (
    <section className="mt-12 rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-50/80 to-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <Package className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Build your set
          </p>
          <h3 className="mt-1 text-lg font-bold text-brand-950">
            Pair {current.name} with more pieces
          </h3>
          <p className="mt-1 text-sm text-brand-600">
            Select items below. {bundlePercent}% off when you add 2+ products.
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {/* Current product always included */}
        <li className="flex items-center gap-3 rounded-lg border border-brand-200 bg-white p-3">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-brand-900 text-white">
            <Check className="h-3 w-3" />
          </span>
          <img
            src={current.images[0]}
            alt=""
            className="h-14 w-11 object-cover rounded bg-brand-100"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{current.name}</p>
            <p className="text-xs text-brand-500">Included</p>
          </div>
          <p className="text-sm font-semibold">{formatPrice(currentUnit)}</p>
        </li>

        {partners.map((p) => {
          const on = selected.has(p.id);
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => toggle(p.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                  on
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-brand-200 bg-white hover:border-brand-400'
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded border',
                    on
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-brand-300'
                  )}
                >
                  {on && <Check className="h-3 w-3" />}
                </span>
                <img
                  src={p.images[0]}
                  alt=""
                  className="h-14 w-11 object-cover rounded bg-brand-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <Link
                    to={`/product/${p.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-brand-500 hover:underline"
                  >
                    View details
                  </Link>
                </div>
                <p className="text-sm font-semibold">{formatPrice(unitPrice(p))}</p>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-brand-200 pt-4">
        <div className="text-sm">
          {itemCount >= 2 ? (
            <>
              <span className="font-semibold text-brand-950">
                {formatPrice(bundleTotal)}
              </span>
              <span className="ml-2 text-brand-400 line-through">
                {formatPrice(separate)}
              </span>
              <span className="ml-2 text-emerald-700 font-medium">
                Save {formatPrice(save)}
              </span>
            </>
          ) : (
            <span className="text-brand-500">
              Select partners to unlock {bundlePercent}% off
            </span>
          )}
        </div>
        <Button
          size="md"
          onClick={addBundle}
          disabled={selectedProducts.length === 0}
        >
          Add set to cart
        </Button>
      </div>
    </section>
  );
}
