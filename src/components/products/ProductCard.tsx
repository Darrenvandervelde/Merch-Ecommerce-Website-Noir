import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { formatPrice, getDiscountPercent } from '../../utils/format';
import { cn } from '../../utils/cn';
import { Button } from '../common/Button';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const discount = product.salePrice
    ? getDiscountPercent(product.price, product.salePrice)
    : 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
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
          {discount > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleWishlist}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm transition-all',
            'opacity-0 group-hover:opacity-100 focus:opacity-100',
            isInWishlist && 'opacity-100 text-red-500'
          )}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={cn('h-4 w-4', isInWishlist && 'fill-current')}
          />
        </button>

        {/* Quick add (shows on hover) – for demo we just link to product */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            
            size="sm"
            fullWidth
            className="bg-white text-brand-900 hover:bg-brand-50 shadow-md"
            onClick={(e) => {
              e.preventDefault();
              // In a full version this could open a quick-view modal
              window.location.href = `/product/${product.slug}`;
            }}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Quick View
          </Button>
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

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1 text-xs text-brand-500">
          <span className="text-amber-500">★</span>
          <span>{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>
      </div>
    </article>
  );
}
