import { useMemo, useState, useEffect } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSearchParams } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { ProductGrid } from '../components/products/ProductGrid';
import type { ProductCategory, SortOption } from '../types';

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export function Shop() {
  const products = useAdminStore((s) => s.products);
  useDocumentTitle('Shop', 'Shop premium hoodies and T-shirts from NOIR.');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'featured'
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(150);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [search, setSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const category =
    (searchParams.get('category') as ProductCategory | 'all') || 'all';

  const ALL_COLOURS = Array.from(
    new Set(products.flatMap((p) => p.colours))
  ).sort();

  const filtered = useMemo(() => {
    let list = [...products];

    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        selectedSizes.some((s) => p.sizes.includes(s))
      );
    }

    if (selectedColours.length > 0) {
      list = list.filter((p) =>
        selectedColours.some((c) => p.colours.includes(c))
      );
    }

    list = list.filter((p) => (p.salePrice ?? p.price) <= priceMax);

    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    switch (sort) {
      case 'newest':
        list = [
          ...list.filter((p) => p.newArrival),
          ...list.filter((p) => !p.newArrival),
        ];
        break;
      case 'price-asc':
        list.sort(
          (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
        );
        break;
      case 'price-desc':
        list.sort(
          (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
        );
        break;
      case 'best-selling':
        list = [
          ...list.filter((p) => p.bestseller),
          ...list.filter((p) => !p.bestseller),
        ];
        break;
      case 'highest-rated':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        list = [
          ...list.filter((p) => p.featured),
          ...list.filter((p) => !p.featured),
        ];
        break;
    }

    return list;
  }, [
    products,
    category,
    search,
    sort,
    selectedSizes,
    selectedColours,
    priceMax,
    inStockOnly,
  ]);

  const handleCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'all') params.delete('category');
    else params.set('category', cat);
    setSearchParams(params);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColour = (colour: string) => {
    setSelectedColours((prev) =>
      prev.includes(colour)
        ? prev.filter((c) => c !== colour)
        : [...prev, colour]
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-brand-950">
          Shop
        </h1>
        <p className="mt-2 text-brand-500">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search + mobile filters toggle */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md h-11 px-4 border border-brand-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
          aria-label="Search products"
        />
        <button
          type="button"
          className="lg:hidden h-11 px-4 border border-brand-300 rounded-md text-sm font-medium"
          onClick={() => setFiltersOpen((o) => !o)}
        >
          {filtersOpen ? 'Hide filters' : 'Show filters'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <aside
          className={`lg:w-56 shrink-0 space-y-8 ${
            filtersOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div>
            <h3 className="text-sm font-semibold text-brand-900 mb-3">
              Category
            </h3>
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
            <h3 className="text-sm font-semibold text-brand-900 mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`w-10 h-10 text-xs border rounded-md transition-colors ${
                    selectedSizes.includes(size)
                      ? 'border-brand-900 bg-brand-900 text-white'
                      : 'border-brand-300 hover:border-brand-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-900 mb-3">
              Colour
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {ALL_COLOURS.map((colour) => (
                <label
                  key={colour}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedColours.includes(colour)}
                    onChange={() => toggleColour(colour)}
                    className="rounded border-brand-300"
                  />
                  {colour}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-900 mb-3">
              Max price: ${priceMax}
            </h3>
            <input
              type="range"
              min={20}
              max={150}
              step={5}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full"
              aria-label="Maximum price"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-brand-300"
              />
              In stock only
            </label>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-900 mb-3">
              Sort by
            </h3>
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

        <div className="flex-1">
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
