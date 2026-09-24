import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import promoData from '../data/promoCodes.json';

export type PromoType = 'percent' | 'fixed' | 'shipping';

export interface PromoCode {
  code: string;
  type: PromoType;
  value: number;
  description: string;
  minSubtotal: number;
  active: boolean;
}

interface PromoState {
  appliedCode: string | null;
  applyCode: (
    raw: string,
    subtotal: number
  ) => { success: boolean; message: string };
  clearCode: () => void;
  getDiscountAmount: (subtotal: number) => number;
  isFreeShipping: () => boolean;
  getAppliedPromo: () => PromoCode | null;
}

const catalog: PromoCode[] = promoData.codes as PromoCode[];

function findPromo(code: string): PromoCode | undefined {
  return catalog.find(
    (p) => p.active && p.code.toUpperCase() === code.toUpperCase()
  );
}

export const usePromoStore = create<PromoState>()(
  persist(
    (set, get) => ({
      appliedCode: null,

      applyCode: (raw, subtotal) => {
        const trimmed = raw.trim();
        if (!trimmed) {
          return { success: false, message: 'Enter a promo code.' };
        }
        const promo = findPromo(trimmed);
        if (!promo) {
          return { success: false, message: 'Invalid or expired promo code.' };
        }
        if (subtotal < promo.minSubtotal) {
          return {
            success: false,
            message: `This code requires a minimum subtotal of $${promo.minSubtotal}.`,
          };
        }
        set({ appliedCode: promo.code });
        return {
          success: true,
          message: `Applied: ${promo.description}`,
        };
      },

      clearCode: () => set({ appliedCode: null }),

      getAppliedPromo: () => {
        const code = get().appliedCode;
        if (!code) return null;
        return findPromo(code) ?? null;
      },

      getDiscountAmount: (subtotal) => {
        const promo = get().getAppliedPromo();
        if (!promo) return 0;
        if (subtotal < promo.minSubtotal) return 0;
        if (promo.type === 'percent') {
          return Math.round(subtotal * (promo.value / 100) * 100) / 100;
        }
        if (promo.type === 'fixed') {
          return Math.min(promo.value, subtotal);
        }
        // shipping type does not reduce line items
        return 0;
      },

      isFreeShipping: () => {
        const promo = get().getAppliedPromo();
        return promo?.type === 'shipping';
      },
    }),
    {
      name: 'noir-promo-v1',
      partialize: (s) => ({ appliedCode: s.appliedCode }),
    }
  )
);
