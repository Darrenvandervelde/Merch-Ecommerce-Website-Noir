import { Link } from 'react-router-dom';
import { useCompareStore } from '../store/compareStore';
import { useAdminStore } from '../store/adminStore';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { formatPrice } from '../utils/format';
import { Button } from '../components/common/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function Compare() {
  useDocumentTitle('Compare');
  const items = useCompareStore((s) => s.items);
  const removeItem = useCompareStore((s) => s.removeItem);
  const clear = useCompareStore((s) => s.clear);
  const products = useAdminStore((s) => s.products);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Compare is empty</h1>
        <p className="mt-2 text-brand-500">
          Use the compare icon on product cards (up to 3 items).
        </p>
        <Link to="/shop?category=print3d" className="inline-block mt-6">
          <Button>Browse 3D Lab</Button>
        </Link>
      </div>
    );
  }

  const fullProducts = items.map(
    (i) => products.find((p) => p.id === i.productId) ?? null
  );

  const addDefault = (productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const colour = p.filaments?.[0]?.name ?? p.colours[0] ?? '';
    const size = p.sizes[0] ?? '';
    const r = addItem(p, colour, size, 1);
    addToast(r.message, r.success ? 'success' : 'error');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-brand-950">Compare</h1>
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear all
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b">Spec</th>
              {items.map((i) => (
                <th key={i.productId} className="p-3 border-b min-w-[160px]">
                  <img
                    src={i.image}
                    alt=""
                    className="h-24 w-20 object-cover rounded bg-brand-100 mb-2"
                  />
                  <Link
                    to={`/product/${i.slug}`}
                    className="font-medium hover:underline"
                  >
                    {i.name}
                  </Link>
                  <p className="mt-1 font-semibold">
                    {formatPrice(i.salePrice ?? i.price)}
                  </p>
                  <button
                    type="button"
                    className="text-xs text-brand-500 underline mt-1"
                    onClick={() => removeItem(i.productId)}
                  >
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-b text-brand-500">Category</td>
              {items.map((i) => (
                <td key={i.productId} className="p-3 border-b capitalize">
                  {i.category === 'print3d' ? '3D Lab' : i.category}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border-b text-brand-500">Rating</td>
              {fullProducts.map((p, idx) => (
                <td key={items[idx].productId} className="p-3 border-b">
                  {p
                    ? `★ ${p.rating.toFixed(1)} (${p.reviewCount})`
                    : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border-b text-brand-500">Stock</td>
              {fullProducts.map((p, idx) => (
                <td key={items[idx].productId} className="p-3 border-b">
                  {p
                    ? p.stock > 0
                      ? `${p.stock} in stock`
                      : 'Out of stock'
                    : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border-b text-brand-500">Material</td>
              {items.map((i) => (
                <td key={i.productId} className="p-3 border-b">
                  {i.printSpecs?.material ?? '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border-b text-brand-500">Layer height</td>
              {items.map((i) => (
                <td key={i.productId} className="p-3 border-b">
                  {i.printSpecs?.layerHeight ?? '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border-b text-brand-500">Infill</td>
              {items.map((i) => (
                <td key={i.productId} className="p-3 border-b">
                  {i.printSpecs?.infill ?? '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border-b text-brand-500">Dimensions</td>
              {items.map((i) => (
                <td key={i.productId} className="p-3 border-b">
                  {i.printSpecs?.dimensions ?? '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border-b text-brand-500">Print time</td>
              {items.map((i) => (
                <td key={i.productId} className="p-3 border-b">
                  {i.printSpecs ? `${i.printSpecs.printTimeHours}h` : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border-b text-brand-500">Action</td>
              {items.map((i) => (
                <td key={i.productId} className="p-3 border-b">
                  <Button size="sm" onClick={() => addDefault(i.productId)}>
                    Add to cart
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
