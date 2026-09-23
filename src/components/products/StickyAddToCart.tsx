import { ShoppingBag } from 'lucide-react';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { Product } from '../../types';

interface StickyAddToCartProps {
  product: Product;
  colour: string;
  size: string;
  quantity: number;
  visible: boolean;
  inStock: boolean;
  onAddToCart: () => void;
}

/**
 * Mobile-only sticky purchase bar. Shown when the inline Add to Cart
 * controls have scrolled out of view so shoppers can still convert.
 */
export function StickyAddToCart({
  product,
  colour,
  size,
  quantity,
  visible,
  inStock,
  onAddToCart,
}: StickyAddToCartProps) {
  const price = product.salePrice ?? product.price;
  const variantsReady = Boolean(colour && size);
  const canAdd = variantsReady && inStock;
  const variantLabel = [colour, size].filter(Boolean).join(' / ');

  return (
    <div
      className={cn(
        'lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-brand-200 bg-white/95 backdrop-blur-md shadow-[0_-8px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out',
        visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      )}
      role="region"
      aria-label="Sticky add to cart"
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <img
          src={product.images[0]}
          alt=""
          className="h-12 w-12 shrink-0 rounded-md object-cover bg-brand-100"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-brand-950">
            {product.name}
          </p>
          <p className="truncate text-xs text-brand-500">
            {formatPrice(price)}
            {quantity > 1 ? ` × ${quantity}` : ''}
            {variantLabel ? ` · ${variantLabel}` : ' · Select colour & size'}
          </p>
        </div>
        <Button
          size="md"
          onClick={onAddToCart}
          disabled={!inStock}
          className="shrink-0 min-w-[8.5rem]"
          aria-label={
            !inStock
              ? 'Out of stock'
              : canAdd
                ? 'Add to cart'
                : 'Select colour and size'
          }
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {!inStock ? 'Sold out' : canAdd ? 'Add to Cart' : 'Select options'}
        </Button>
      </div>
    </div>
  );
}
