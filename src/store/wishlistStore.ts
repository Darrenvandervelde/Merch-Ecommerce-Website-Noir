import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, WishlistItem } from '../types';

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (get().isInWishlist(product.id)) return;

        const item: WishlistItem = {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0] ?? '',
          price: product.price,
          salePrice: product.salePrice,
          category: product.category,
        };

        set({ items: [...get().items, item] });
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      isInWishlist: (productId) =>
        get().items.some((item) => item.productId === productId),

      clearWishlist: () => set({ items: [] }),

      getCount: () => get().items.length,
    }),
    {
      name: 'merch-wishlist-v1',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
