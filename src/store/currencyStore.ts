import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import data from '../data/currencies.json';

export type CurrencyCode = 'USD' | 'ZAR' | 'EUR';

interface CurrencyState {
  code: CurrencyCode;
  setCode: (code: CurrencyCode) => void;
  convert: (usdAmount: number) => number;
  format: (usdAmount: number) => string;
}

const rates = data.rates as Record<CurrencyCode, number>;

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      code: 'USD',
      setCode: (code) => set({ code }),
      convert: (usdAmount) => {
        const rate = rates[get().code] ?? 1;
        return Math.round(usdAmount * rate * 100) / 100;
      },
      format: (usdAmount) => {
        const code = get().code;
        const value = get().convert(usdAmount);
        return new Intl.NumberFormat(
          code === 'ZAR' ? 'en-ZA' : code === 'EUR' ? 'en-IE' : 'en-US',
          {
            style: 'currency',
            currency: code,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }
        ).format(value);
      },
    }),
    {
      name: 'noir-currency-v1',
      partialize: (s) => ({ code: s.code }),
    }
  )
);
