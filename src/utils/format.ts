import { useCurrencyStore } from '../store/currencyStore';

/**
 * Format price using the active currency store (USD / ZAR / EUR).
 * Falls back to USD if store is not ready (SSR-safe).
 */
export function formatPrice(amount: number): string {
  try {
    return useCurrencyStore.getState().format(amount);
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}

export function getDiscountPercent(price: number, salePrice: number): number {
  if (price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}
