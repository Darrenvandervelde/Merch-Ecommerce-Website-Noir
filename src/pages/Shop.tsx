import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { ProductGrid } from '../components/products/ProductGrid';
import type { ProductCategory, SortOption } from '../types';

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'featured'
  );

  const category = (searchParams.get('category') as ProductCategory | 'all') || 'all';
  const search = searchParams.get('q') || '';

  const filtered = useMemo(() => {
    let list = [...products];

    // Category filter
    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case 'newest':
        list = list.filter((p) => p.newArrival).concat(list.filter((p) => !p.newArrival));
        break;
      case 'price-asc':
        list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case 'price-desc':
        list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case 'best-selling':
        list = list.filter((p) => p.bestseller).concat(list.filter((p) => !p.bestseller));
        break;
      case 'highest-rated':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        list = list.filter((p) => p.featured).concat(list.filter((p) => !p.featured));
        break;
    }

    return list;
  }, [category, search, sort]);

  const handleCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'all') params.delete('category');
    else params.set('category', cat);
    setSearchParams(params);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-brand-950">Shop</h1>
        <p className="mt-2 text-brand-500">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar filters */}
        <aside className="lg:w-56 shrink-0 space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-brand-900 mb-3">Category</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'tshirt', label: 'T-Shirts' },
                { value: 'hoodie', label: 'Hoodies' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleCategory(opt.value)}
                  className={`block w-full text-left text-sm py-1.5 transition-colors ${
                    category === opt.value
                      ? 'font-medium text-brand-950'
                      : 'text-brand-600 hover:text-brand-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-900 mb-3">Sort by</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="w-full h-10 px-3 border border-brand-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="best-selling">Best Selling</option>
              <option value="highest-rated">Highest Rated</option>
            </select>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
