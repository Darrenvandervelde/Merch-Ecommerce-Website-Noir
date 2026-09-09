import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ShopTheLookProps {
  current: Product;
  products: Product[];
}

/**
 * Suggests complementary items (other category first, then same category).
 * Streetwear "shop the look" style block.
 */
export function ShopTheLook({ current, products }: ShopTheLookProps) {
  const otherCategory = products.filter(
    (p) => p.category !== current.category && p.id !== current.id
  );
  const sameCategory = products.filter(
    (p) => p.category === current.category && p.id !== current.id
  );
  const look = [...otherCategory.slice(0, 2), ...sameCategory.slice(0, 2)].slice(
    0,
    4
  );

  if (look.length === 0) return null;

  return (
    <section className="mt-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-brand-950">
          Shop the look
        </h2>
        <p className="mt-2 text-brand-500">
          Pair the {current.name} with these pieces
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {look.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
