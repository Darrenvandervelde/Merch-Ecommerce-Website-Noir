import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import { Button } from '../common/Button';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';

interface BundleUpsellProps {
  current: Product;
  catalog: Product[];
}

export function BundleUpsell({ current, catalog }: BundleUpsellProps) {
  const ids = current.bundleWith ?? [];
  if (ids.length === 0) return null;

  const partners = catalog.filter((p) => ids.includes(p.id));
  if (partners.length === 0) return null;

  const partner = partners[0];
  const unitA = current.salePrice ?? current.price;
  const unitB = partner.salePrice ?? partner.price;
  const separate = unitA + unitB;
  const bundlePrice = Math.round(separate * 0.9 * 100) / 100;
  const save = separate - bundlePrice;

  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  const addBundle = () => {
    const colourA = current.filaments?.[0]?.name ?? current.colours[0] ?? '';
    const sizeA = current.sizes[0] ?? '';
    const colourB = partner.filaments?.[0]?.name ?? partner.colours[0] ?? '';
    const sizeB = partner.sizes[0] ?? '';
    const r1 = addItem(current, colourA, sizeA, 1);
    const r2 = addItem(partner, colourB, sizeB, 1);
    if (r1.success && r2.success) {
      addToast(`Bundle added - save ${formatPrice(save)}`, 'success');
    } else {
      addToast(r1.message || r2.message, 'error');
    }
  };

  return (
    <div className="mt-10 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
        Complete the setup
      </p>
      <h3 className="mt-1 text-lg font-bold text-brand-950">
        Pair with {partner.name}
      </h3>
      <p className="mt-1 text-sm text-brand-600">
        Bundle price {formatPrice(bundlePrice)}{' '}
        <span className="text-brand-400 line-through">{formatPrice(separate)}</span>
        {' · '}
        <span className="text-emerald-700 font-medium">Save {formatPrice(save)}</span>
      </p>
      <div className="mt-4 flex items-center gap-4">
        <Link to={`/product/${partner.slug}`} className="shrink-0">
          <img
            src={partner.images[0]}
            alt={partner.name}
            className="h-20 w-16 object-cover rounded bg-brand-100"
          />
        </Link>
        <div className="flex-1 text-sm">
          <p className="font-medium">{partner.name}</p>
          <p className="text-brand-500">{formatPrice(unitB)}</p>
        </div>
        <Button size="sm" onClick={addBundle}>
          Add bundle
        </Button>
      </div>
    </div>
  );
}
