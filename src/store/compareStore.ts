import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompareItem, Product } from '../types';

interface CompareState {
  items: CompareItem[];
  addItem: (product: Product) => { success: boolean; message: string };
  removeItem: (productId: string) => void;
  clear: () => void;
  isComparing: (productId: string) => boolean;
}

const MAX = 3;

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (get().items.some((i) => i.productId === product.id)) {
          return { success: false, message: 'Already in compare' };
        }
        if (get().items.length >= MAX) {
          return {
            success: false,
            message: `Compare up to ${MAX} items. Remove one first.`,
          };
        }
        const item: CompareItem = {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0] ?? '',
          price: product.price,
          salePrice: product.salePrice,
          category: product.category,
          printSpecs: product.printSpecs,
        };
        set({ items: [...get().items, item] });
        return { success: true, message: 'Added to compare' };
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      clear: () => set({ items: [] }),
      isComparing: (productId) =>
        get().items.some((i) => i.productId === productId),
    }),
    { name: 'noir-compare-v1', partialize: (s) => ({ items: s.items }) }
  )
);
