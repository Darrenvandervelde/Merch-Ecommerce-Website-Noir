import settingsJson from '../data/settings.json';

/**
 * Typed app settings loaded from JSON.
 * Mirror of settings.ini for documentation / non-bundled edits.
 * Runtime uses this module so Vite can tree-shake and type-check.
 */
export const settings = settingsJson;

export type AppSettings = typeof settingsJson;

export function getFreeShippingThreshold(): number {
  return settings.app.freeShippingThreshold;
}

export function getShippingFlatRate(): number {
  return settings.app.shippingFlatRate;
}

export function getTaxRate(): number {
  return settings.app.taxRate;
}

export function getMadeToOrderLeadDays(): number {
  return settings.lab3d.madeToOrderLeadDays;
}
