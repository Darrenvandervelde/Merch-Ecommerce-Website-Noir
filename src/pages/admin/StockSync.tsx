import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useToastStore } from '../../store/toastStore';
import { fetchProducts } from '../../api/products';
import { Button } from '../../components/common/Button';

/**
 * Syncs stock from Express API when online; otherwise shows local low-stock list.
 */
export function AdminStockSync() {
  const products = useAdminStore((s) => s.products);
  const threshold = useAdminStore((s) => s.lowStockThreshold);
  const setThreshold = useAdminStore((s) => s.setLowStockThreshold);
  const updateProductStock = useAdminStore((s) => s.updateProductStock);
  const addToast = useToastStore((s) => s.addToast);
  const [syncing, setSyncing] = useState(false);
  const [lastSource, setLastSource] = useState<'api' | 'local' | null>(null);

  const low = products.filter((p) => p.stock < threshold);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { products: remote, source } = await fetchProducts();
      setLastSource(source);
      if (source === 'api') {
        remote.forEach((p) => updateProductStock(p.id, p.stock));
        addToast(`Stock synced from API (${remote.length} products)`, 'success');
      } else {
        addToast('API offline — showing local stock only', 'info');
      }
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : 'Sync failed',
        'error'
      );
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-950">Stock sync</h1>
        <p className="mt-1 text-sm text-brand-500">
          Pull stock levels from the Express API or manage the low-stock threshold.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-brand-200 bg-white p-4">
        <div>
          <label className="block text-xs font-medium text-brand-600 mb-1">
            Low-stock threshold
          </label>
          <input
            type="number"
            min={1}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="h-10 w-24 px-3 border border-brand-300 rounded-md text-sm"
          />
        </div>
        <Button onClick={handleSync} isLoading={syncing}>
          Sync from API
        </Button>
        {lastSource && (
          <p className="text-xs text-brand-500">Last source: {lastSource}</p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">
          Low stock ({low.length})
        </h2>
        {low.length === 0 ? (
          <p className="text-sm text-brand-500">All products above threshold.</p>
        ) : (
          <ul className="divide-y divide-brand-100 rounded-lg border border-brand-200 bg-white">
            {low.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="font-medium">{p.name}</span>
                <span
                  className={
                    p.stock === 0
                      ? 'text-red-600 font-semibold'
                      : 'text-amber-600'
                  }
                >
                  {p.stock} left
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
