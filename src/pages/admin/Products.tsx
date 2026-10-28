import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useToastStore } from '../../store/toastStore';
import { updateProduct, createProduct, deleteProduct } from '../../api/products';
import { formatPrice } from '../../utils/format';
import { Button } from '../../components/common/Button';
import type { Product, ProductCategory } from '../../types';

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function AdminProducts() {
  const products = useAdminStore((s) => s.products);
  const updateProductPrice = useAdminStore((s) => s.updateProductPrice);
  const updateProductStock = useAdminStore((s) => s.updateProductStock);
  const toggleProductFlag = useAdminStore((s) => s.toggleProductFlag);
  const addProduct = useAdminStore((s) => s.addProduct);
  const removeProduct = useAdminStore((s) => s.removeProduct);
  const addToast = useToastStore((s) => s.addToast);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editSale, setEditSale] = useState('');
  const [editStock, setEditStock] = useState('');
  const [filter, setFilter] = useState<'all' | ProductCategory>('all');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('49');
  const [newCategory, setNewCategory] = useState<ProductCategory>('tshirt');

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

  const saveEdit = async (id: string) => {
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

    try {
      await updateProduct(id, { price, salePrice: sale, stock });
      updateProductPrice(id, price, sale);
      updateProductStock(id, stock);
      addToast('Product updated', 'success');
      cancelEdit();
    } catch (err) {
      updateProductPrice(id, price, sale);
      updateProductStock(id, stock);
      addToast(
        err instanceof Error
          ? `${err.message} (saved locally)`
          : 'Saved locally',
        'info'
      );
      cancelEdit();
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      addToast('Name required', 'error');
      return;
    }
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      addToast('Invalid price', 'error');
      return;
    }
    const slug = slugify(newName);
    const product: Product = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      slug,
      category: newCategory,
      description: 'Added from admin (demo).',
      price,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      ],
      colours: ['Black'],
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 20,
      rating: 0,
      reviewCount: 0,
      featured: false,
      bestseller: false,
      newArrival: true,
    };

    try {
      const remote = await createProduct(product);
      addProduct(remote);
    } catch {
      addProduct(product);
    }
    addToast('Product created', 'success');
    setShowCreate(false);
    setNewName('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product from the local catalogue?')) return;
    try {
      await deleteProduct(id);
    } catch {
      /* offline ok */
    }
    removeProduct(id);
    addToast('Product removed', 'info');
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Products</h1>
          <p className="mt-1 text-sm text-brand-500">
            Manage catalogue, pricing and stock (CRUD)
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate((v) => !v)}>
          {showCreate ? 'Cancel' : 'Add product'}
        </Button>
      </div>

      {showCreate && (
        <div className="mb-6 rounded-lg border border-brand-200 bg-white p-4 space-y-3 max-w-lg">
          <p className="text-sm font-medium">New product</p>
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full h-10 px-3 border border-brand-300 rounded-md text-sm"
          />
          <div className="flex gap-3">
            <input
              type="number"
              min="0"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-28 h-10 px-3 border border-brand-300 rounded-md text-sm"
              aria-label="Price"
            />
            <select
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value as ProductCategory)
              }
              className="h-10 px-3 border border-brand-300 rounded-md text-sm"
            >
              <option value="tshirt">T-Shirt</option>
              <option value="hoodie">Hoodie</option>
              <option value="print3d">3D Lab</option>
            </select>
          </div>
          <Button size="sm" onClick={handleCreate}>
            Create
          </Button>
        </div>
      )}

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
          <option value="print3d">3D Lab</option>
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
                        placeholder="-"
                        value={editSale}
                        onChange={(e) => setEditSale(e.target.value)}
                        className="w-24 h-9 px-2 border border-brand-300 rounded text-sm"
                      />
                    ) : p.salePrice != null ? (
                      <span className="text-red-600 font-medium">
                        {formatPrice(p.salePrice)}
                      </span>
                    ) : (
                      <span className="text-brand-400">-</span>
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </Button>
                      </div>
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
        Changes save locally and attempt the Express API when available.
      </p>
    </div>
  );
}
