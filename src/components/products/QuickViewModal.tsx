import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useToastStore } from '../../store/toastStore';
import { formatPrice, getDiscountPercent } from '../../utils/format';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Modal that lets shoppers preview a product, pick colour/size, and add to cart
 * without navigating away from the shop grid.
 */
export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const [colour, setColour] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const addItem = useCartStore((s) => s.addItem);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const isInWishlist = useWishlistStore((s) =>
    product ? s.isInWishlist(product.id) : false
  );
  const addToast = useToastStore((s) => s.addToast);

  // Reset local state whenever a different product opens
  useEffect(() => {
    if (product && open) {
      setColour('');
      setSize('');
      setQty(1);
      setActiveImage(0);
    }
  }, [product?.id, open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !product) return null;

  const discount = product.salePrice
    ? getDiscountPercent(product.price, product.salePrice)
    : 0;
  const inStock = product.stock > 0;
  const isPrint = product.category === 'print3d';
  const colourLabel = isPrint ? 'Finish / colour' : 'Colour';
  const sizeLabel = isPrint ? 'Size / scale' : 'Size';

  const handleAddToCart = () => {
    const result = addItem(product, colour, size, qty);
    addToast(result.message, result.success ? 'success' : 'error');
    if (result.success) onClose();
  };

  const handleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      addToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      addToast('Added to wishlist', 'success');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close quick view"
      />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:flex-row">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 shadow-sm transition hover:bg-white"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-brand-900" />
        </button>

        {/* Image column */}
        <div className="relative w-full shrink-0 bg-brand-100 sm:w-1/2">
          <div className="aspect-[3/4] sm:aspect-auto sm:h-full">
            <img
              src={product.images[activeImage] ?? product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'h-12 w-12 shrink-0 overflow-hidden rounded border-2 transition',
                    activeImage === i
                      ? 'border-brand-900'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details column */}
        <div className="flex flex-1 flex-col overflow-y-auto p-5 sm:p-6">
          <h2
            id="quick-view-title"
            className="pr-8 text-xl font-bold tracking-tight text-brand-950"
          >
            {product.name}
          </h2>

          <div className="mt-2 flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-semibold text-brand-900">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-brand-400 line-through">
                  {formatPrice(product.price)}
                </span>
                {discount > 0 && (
                  <span className="text-xs font-medium text-red-600">
                    -{discount}%
                  </span>
                )}
              </>
            ) : (
              <span className="text-lg font-semibold text-brand-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-1 text-xs text-brand-500">
            <span className="text-amber-500">★</span>
            {product.rating.toFixed(1)} ({product.reviewCount})
          </div>

          <p className="mt-3 line-clamp-3 text-sm text-brand-600">
            {product.description}
          </p>

          {/* Colour */}
          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-brand-900">
              {colourLabel}:{' '}
              <span className="font-normal">{colour || 'Select'}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colours.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColour(c)}
                  className={cn(
                    'rounded-md border px-3 py-1.5 text-sm transition-colors',
                    colour === c
                      ? 'border-brand-900 bg-brand-900 text-white'
                      : 'border-brand-300 hover:border-brand-500'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-brand-900">
              {sizeLabel}:{' '}
              <span className="font-normal">{size || 'Select'}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md border text-sm transition-colors',
                    size === s
                      ? 'border-brand-900 bg-brand-900 text-white'
                      : 'border-brand-300 hover:border-brand-500'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-brand-900">Quantity</p>
            <div className="inline-flex items-center rounded-md border border-brand-300">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-brand-50"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="p-2.5 hover:bg-brand-50"
                aria-label="Increase quantity"
                disabled={!inStock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p
              className={cn(
                'mt-1.5 text-xs font-medium',
                !inStock
                  ? 'text-red-600'
                  : product.stock <= 5
                    ? 'text-amber-600'
                    : 'text-emerald-700'
              )}
            >
              {!inStock
                ? 'Out of stock'
                : product.stock <= 5
                  ? `Only ${product.stock} left`
                  : `${product.stock} in stock`}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button
              size="md"
              fullWidth
              onClick={handleAddToCart}
              disabled={!colour || !size || !inStock}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button size="md" variant="outline" onClick={handleWishlist}>
              <Heart
                className={cn(
                  'h-4 w-4',
                  isInWishlist && 'fill-current text-red-500'
                )}
              />
            </Button>
          </div>

          {(!colour || !size) && inStock && (
            <p className="mt-2 text-xs text-brand-500">
              Select colour and size to add to cart.
            </p>
          )}

          <Link
            to={`/product/${product.slug}`}
            onClick={onClose}
            className="mt-4 text-center text-sm font-medium text-brand-700 underline-offset-2 hover:underline"
          >
            View full details →
          </Link>
        </div>
      </div>
    </div>
  );
}
