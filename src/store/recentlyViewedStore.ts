import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductCategory } from '../types';

export interface RecentlyViewedItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  salePrice?: number;
  category: ProductCategory;
  viewedAt: number;
}

const MAX_ITEMS = 12;

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  track: (product: Product) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      track: (product) => {
        const next: RecentlyViewedItem = {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0] ?? '',
          price: product.price,
          salePrice: product.salePrice,
          category: product.category,
          viewedAt: Date.now(),
        };

        const filtered = get().items.filter((i) => i.productId !== product.id);
        set({
          items: [next, ...filtered].slice(0, MAX_ITEMS),
        });
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: 'noir-recently-viewed-v1',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
