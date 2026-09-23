import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import { formatPrice } from '../utils/format';
import { EmptyState } from '../components/common/EmptyState';
import { Heart } from 'lucide-react';

export function Wishlist() {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Save pieces you love while you browse. Tap the heart on any product to keep it here for later."
        actionLabel="Discover products"
        actionTo="/shop"
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950 mb-10">
        Wishlist ({items.length})
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.productId} className="group">
            <Link to={`/product/${item.slug}`}>
              <div className="aspect-[3/4] bg-brand-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="mt-3 text-sm font-medium">{item.name}</h3>
              <p className="mt-1 text-sm font-semibold">
                {formatPrice(item.salePrice ?? item.price)}
              </p>
            </Link>
            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="mt-2 text-xs text-brand-500 hover:text-red-600 underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
