import { apiClient } from './client';
import type { Product } from '../types';
import { products as mockProducts, getProductBySlug as mockGetBySlug } from '../data/products';

/**
 * Product API layer.
 * Currently falls back to mock data so the frontend works without a backend.
 * Replace the mock implementations with real API calls when ready.
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data } = await apiClient.get<Product[]>('/products');
    return data;
  } catch {
    // Fallback for development / offline
    return mockProducts;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await apiClient.get<Product>(`/products/${slug}`);
    return data;
  } catch {
    return mockGetBySlug(slug) ?? null;
  }
}
