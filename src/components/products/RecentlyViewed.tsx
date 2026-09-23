import { Link } from 'react-router-dom';
import { useRecentlyViewedStore } from '../../store/recentlyViewedStore';
import { formatPrice } from '../../utils/format';

interface RecentlyViewedProps {
  /** Exclude the product currently being viewed */
  excludeId?: string;
  limit?: number;
}

export function RecentlyViewed({ excludeId, limit = 8 }: RecentlyViewedProps) {
  const items = useRecentlyViewedStore((s) => s.items);
  const list = items
    .filter((i) => i.productId !== excludeId)
    .slice(0, limit);

  if (list.length === 0) return null;

  return (
    <section className="mt-16 border-t border-brand-200 pt-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-brand-950">
            Recently viewed
          </h2>
          <p className="mt-1 text-sm text-brand-500">
            Pick up where you left off
          </p>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
        {list.map((item) => (
          <Link
            key={item.productId}
            to={`/product/${item.slug}`}
            className="group shrink-0 w-36 sm:w-40 snap-start"
          >
            <div className="aspect-[3/4] overflow-hidden bg-brand-100 rounded-md">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-xs font-medium text-brand-900 line-clamp-2 group-hover:underline">
              {item.name}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-brand-800">
              {formatPrice(item.salePrice ?? item.price)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
