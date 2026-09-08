import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  // Actions
  addItem: (
    product: Product,
    colour: string,
    size: string,
    quantity?: number
  ) => { success: boolean; message: string };
  removeItem: (productId: string, colour: string, size: string) => void;
  updateQuantity: (
    productId: string,
    colour: string,
    size: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  // Selectors
  getItemCount: () => number;
  getSubtotal: () => number;
  getItemKey: (productId: string, colour: string, size: string) => string;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      getItemKey: (productId, colour, size) =>
        `${productId}__${colour}__${size}`,

      addItem: (product, colour, size, quantity = 1) => {
        if (!colour || !size) {
          return {
            success: false,
            message: 'Please select both colour and size.',
          };
        }

        const state = get();
        const existingIndex = state.items.findIndex(
          (item) =>
            item.productId === product.id &&
            item.colour === colour &&
            item.size === size
        );

        // Stock check
        const currentQty =
          existingIndex >= 0 ? state.items[existingIndex].quantity : 0;
        const requestedTotal = currentQty + quantity;

        if (requestedTotal > product.stock) {
          return {
            success: false,
            message: `Only ${product.stock} left in stock.`,
          };
        }

        if (existingIndex >= 0) {
          // Update quantity
          const updated = [...state.items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: requestedTotal,
          };
          set({ items: updated });
        } else {
          // Add new line item
          const newItem: CartItem = {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0] ?? '',
            price: product.price,
            salePrice: product.salePrice,
            colour,
            size,
            quantity,
            maxStock: product.stock,
          };
          set({ items: [...state.items, newItem] });
        }

        return { success: true, message: 'Added to cart' };
      },

      removeItem: (productId, colour, size) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.colour === colour &&
                item.size === size
              )
          ),
        });
      },

      updateQuantity: (productId, colour, size, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, colour, size);
          return;
        }

        set({
          items: get().items.map((item) => {
            if (
              item.productId === productId &&
              item.colour === colour &&
              item.size === size
            ) {
              const clamped = Math.min(quantity, item.maxStock);
              return { ...item, quantity: clamped };
            }
            return item;
          }),
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => {
          const unit = item.salePrice ?? item.price;
          return sum + unit * item.quantity;
        }, 0),
    }),
    {
      name: 'merch-cart-v1', // localStorage key
      // Only persist the items array
      partialize: (state) => ({ items: state.items }),
    }
  )
);
