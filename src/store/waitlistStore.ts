import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WaitlistEntry {
  id: string;
  productId: string;
  productName: string;
  colour: string;
  size: string;
  email: string;
  createdAt: string;
}

interface WaitlistState {
  entries: WaitlistEntry[];
  addEntry: (entry: Omit<WaitlistEntry, 'id' | 'createdAt'>) => {
    success: boolean;
    message: string;
  };
  removeEntry: (id: string) => void;
  getByProduct: (productId: string) => WaitlistEntry[];
}

export const useWaitlistStore = create<WaitlistState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: ({ productId, productName, colour, size, email }) => {
        const existing = get().entries.find(
          (e) =>
            e.productId === productId &&
            e.colour === colour &&
            e.size === size &&
            e.email.toLowerCase() === email.toLowerCase()
        );
        if (existing) {
          return {
            success: false,
            message: 'You are already on the waitlist for this variant.',
          };
        }
        const entry: WaitlistEntry = {
          id: `wl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          productId,
          productName,
          colour,
          size,
          email: email.trim(),
          createdAt: new Date().toISOString(),
        };
        set({ entries: [...get().entries, entry] });
        return { success: true, message: 'You will be notified when this is back in stock.' };
      },

      removeEntry: (id) => {
        set({ entries: get().entries.filter((e) => e.id !== id) });
      },

      getByProduct: (productId) =>
        get().entries.filter((e) => e.productId === productId),
    }),
    {
      name: 'noir-waitlist-v1',
      partialize: (state) => ({ entries: state.entries }),
    }
  )
);
