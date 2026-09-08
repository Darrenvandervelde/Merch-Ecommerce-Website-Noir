import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useToastStore } from '../../store/toastStore';
import { formatPrice } from '../../utils/format';
import { Button } from '../../components/common/Button';
import type { Product } from '../../types';

export function AdminProducts() {
  const products = useAdminStore((s) => s.products);
  const updateProductPrice = useAdminStore((s) => s.updateProductPrice);
  const updateProductStock = useAdminStore((s) => s.updateProductStock);
  const toggleProductFlag = useAdminStore((s) => s.toggleProductFlag);
  const addToast = useToastStore((s) => s.addToast);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editSale, setEditSale] = useState('');
  const [editStock, setEditStock] = useState('');
  const [filter, setFilter] = useState<'all' | 'tshirt' | 'hoodie'>('all');
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) => {
    if (filter !== 'all' && p.category !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditPrice(String(p.price));
    setEditSale(p.salePrice != null ? String(p.salePrice) : '');
    setEditStock(String(p.stock));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPrice('');
    setEditSale('');
    setEditStock('');
  };

  const saveEdit = (id: string) => {
    const price = parseFloat(editPrice);
    const sale = editSale.trim() === '' ? null : parseFloat(editSale);
    const stock = parseInt(editStock, 10);

    if (isNaN(price) || price < 0) {
      addToast('Invalid price', 'error');
      return;
    }
    if (sale !== null && (isNaN(sale) || sale < 0 || sale >= price)) {
      addToast('Sale price must be lower than regular price', 'error');
      return;
    }
    if (isNaN(stock) || stock < 0) {
      addToast('Invalid stock', 'error');
      return;
    }

    updateProductPrice(id, price, sale);
    updateProductStock(id, stock);
    addToast('Product updated', 'success');
    cancelEdit();
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Products</h1>
          <p className="mt-1 text-sm text-brand-500">
            Manage catalogue, pricing and stock
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 px-3 border border-brand-300 rounded-md text-sm max-w-xs focus:outline-none focus:ring-2 focus:ring-brand-900"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="h-10 px-3 border border-brand-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
        >
          <option value="all">All categories</option>
          <option value="tshirt">T-Shirts</option>
          <option value="hoodie">Hoodies</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-brand-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-brand-50 border-b border-brand-200 text-brand-600">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Sale</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Flags</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {filtered.map((p) => {
              const isEditing = editingId === p.id;
              return (
                <tr key={p.id} className="hover:bg-brand-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-10 h-12 object-cover rounded bg-brand-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-brand-900 truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-brand-400">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-brand-600">
                    {p.category}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-24 h-9 px-2 border border-brand-300 rounded text-sm"
                      />
                    ) : (
                      formatPrice(p.price)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="—"
                        value={editSale}
                        onChange={(e) => setEditSale(e.target.value)}
                        className="w-24 h-9 px-2 border border-brand-300 rounded text-sm"
                      />
                    ) : p.salePrice != null ? (
                      <span className="text-red-600 font-medium">
                        {formatPrice(p.salePrice)}
                      </span>
                    ) : (
                      <span className="text-brand-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-20 h-9 px-2 border border-brand-300 rounded text-sm"
                      />
                    ) : (
                      <span
                        className={
                          p.stock < 20
                            ? 'text-red-600 font-medium'
                            : p.stock < 40
                              ? 'text-amber-600'
                              : ''
                        }
                      >
                        {p.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(['featured', 'bestseller', 'newArrival'] as const).map(
                        (flag) => (
                          <button
                            key={flag}
                            type="button"
                            onClick={() => toggleProductFlag(p.id, flag)}
                            className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide ${
                              p[flag]
                                ? 'bg-brand-900 text-white'
                                : 'bg-brand-100 text-brand-500'
                            }`}
                          >
                            {flag === 'newArrival' ? 'new' : flag.slice(0, 4)}
                          </button>
                        )
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(p.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-brand-500">
            No products match your filters
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-brand-400">
        Price and stock changes are saved locally (localStorage) and will
        reflect on the storefront after refresh. In production these would
        call your backend API.
      </p>
    </div>
  );
}
