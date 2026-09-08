/**
 * Format price as USD currency.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate discount percentage.
 */
export function getDiscountPercent(price: number, salePrice: number): number {
  if (price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}
