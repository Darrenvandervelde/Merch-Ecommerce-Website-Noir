import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, GitCompare, Eye } from 'lucide-react';
import type { Product } from '../../types';

import { useWishlistStore } from '../../store/wishlistStore';
import { useToastStore } from '../../store/toastStore';
import { useCompareStore } from '../../store/compareStore';
import { formatPrice, getDiscountPercent } from '../../utils/format';
import { cn } from '../../utils/cn';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const addToast = useToastStore((s) => s.addToast);
  const addCompare = useCompareStore((s) => s.addItem);
  const removeCompare = useCompareStore((s) => s.removeItem);
  const isComparing = useCompareStore((s) => s.isComparing(product.id));

  const discount = product.salePrice
    ? getDiscountPercent(product.price, product.salePrice)
    : 0;

  const isMadeToOrder =
    product.category === 'print3d' && (product.stock <= 10 || product.stock === 0);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      addToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      addToast('Added to wishlist', 'success');
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <article className={cn('group relative flex flex-col bg-white', className)}>
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden bg-brand-100"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.newArrival && (
            <span className="bg-brand-900 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
              New
            </span>
          )}
          {product.bestseller && (
            <span className="bg-white text-brand-900 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 shadow-sm">
              Bestseller
            </span>
          )}
          {product.category === 'print3d' && (
            <span className="bg-emerald-500 text-brand-950 text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
              3D Lab
            </span>
          )}
          {isMadeToOrder && (
            <span className="bg-emerald-900 text-emerald-50 text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
              Made to order
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-brand-800 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
              Sold out
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="bg-amber-500 text-brand-950 text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
              Only {product.stock} left
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleWishlist}
            className={cn(
              'p-2 rounded-full bg-white/90 shadow-sm transition-all',
              'opacity-0 group-hover:opacity-100 focus:opacity-100',
              isInWishlist && 'opacity-100 text-red-500'
    <>
      <article
        className={cn(
          'group relative flex flex-col bg-white',
          className
        )}
      >
        {/* Image */}
        <Link
          to={`/product/${product.slug}`}
          className="relative aspect-[3/4] overflow-hidden bg-brand-100"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.newArrival && (
              <span className="bg-brand-900 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
                New
              </span>
            )}
            {product.bestseller && (
              <span className="bg-white text-brand-900 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 shadow-sm">
                Bestseller
              </span>
            )}
            {product.category === 'print3d' && (
              <span className="bg-emerald-500 text-brand-950 text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
                3D Lab
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
                -{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-brand-800 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
                Sold out
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="bg-amber-500 text-brand-950 text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
                Only {product.stock} left
              </span>
            )}
            {product.stock > 5 && product.stock <= 15 && (
              <span className="bg-white/90 text-brand-800 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 shadow-sm">
                {product.stock} in stock
              </span>
            )}
          </div>

        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="flex h-9 w-full items-center justify-center rounded-md bg-white text-brand-900 text-sm font-medium shadow-md">
            <ShoppingBag className="h-4 w-4 mr-2" />
            View product
          </span>
        </div>
      </Link>

      <div className="mt-4 flex flex-col flex-1">
        <Link to={`/product/${product.slug}`} className="group/title">
          <h3 className="text-sm font-medium text-brand-900 group-hover/title:underline underline-offset-2">
            {product.name}
          </h3>
          {/* Wishlist + compare */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={handleWishlist}
              className={cn(
                'p-2 rounded-full bg-white/90 shadow-sm transition-all',
                'opacity-0 group-hover:opacity-100 focus:opacity-100',
                isInWishlist && 'opacity-100 text-red-500'
              )}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('h-4 w-4', isInWishlist && 'fill-current')} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isComparing) {
                  removeCompare(product.id);
                  addToast('Removed from compare', 'info');
                } else {
                  const r = addCompare(product);
                  addToast(r.message, r.success ? 'success' : 'error');
                }
              }}
              className={cn(
                'p-2 rounded-full bg-white/90 shadow-sm transition-all',
                'opacity-0 group-hover:opacity-100 focus:opacity-100',
                isComparing && 'opacity-100 text-emerald-600'
              )}
              aria-label={isComparing ? 'Remove from compare' : 'Compare'}
            >
              <GitCompare className="h-4 w-4" />
            </button>
          </div>

          {/* Hover actions: Quick view + View product */}
          <div className="absolute inset-x-0 bottom-0 flex gap-2 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              type="button"
              onClick={handleQuickView}
              className="flex h-9 flex-1 items-center justify-center rounded-md bg-white text-brand-900 text-sm font-medium shadow-md hover:bg-brand-50"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Quick view
            </button>
            <span className="flex h-9 flex-1 items-center justify-center rounded-md bg-brand-900 text-white text-sm font-medium shadow-md">
              <ShoppingBag className="h-4 w-4 mr-1.5" />
              View
            </span>
          </div>
        </Link>

        {/* Info */}
        <div className="mt-4 flex flex-col flex-1">
          <Link to={`/product/${product.slug}`} className="group/title">
            <h3 className="text-sm font-medium text-brand-900 group-hover/title:underline underline-offset-2">
              {product.name}
            </h3>
          </Link>

          <div className="mt-1 flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-sm font-semibold text-brand-900">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-brand-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-brand-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

        <div className="mt-1.5 flex items-center gap-1 text-xs text-brand-500">
          <span className="text-amber-500">★</span>
          <span>{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>
        <p
          className={`mt-1 text-xs font-medium ${
            product.stock === 0
              ? 'text-red-600'
              : product.stock <= 5
                ? 'text-amber-600'
                : 'text-emerald-700'
          }`}
        >
          {product.stock === 0
            ? isMadeToOrder
              ? 'Made to order'
              : 'Out of stock'
            : product.stock <= 5
              ? `Only ${product.stock} left`
              : `${product.stock} in stock`}
        </p>
      </div>
    </article>
          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1 text-xs text-brand-500">
            <span className="text-amber-500">★</span>
            <span>{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </div>
          <p
            className={`mt-1 text-xs font-medium ${
              product.stock === 0
                ? 'text-red-600'
                : product.stock <= 5
                  ? 'text-amber-600'
                  : 'text-emerald-700'
            }`}
          >
            {product.stock === 0
              ? 'Out of stock'
              : product.stock <= 5
                ? `Only ${product.stock} left`
                : `${product.stock} in stock`}
          </p>
        </div>
      </article>

      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
