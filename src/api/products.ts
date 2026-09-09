import { apiClient } from './client';
import type { Product } from '../types';
import { products as mockProducts, getProductBySlug as mockGetBySlug } from '../data/products';

export async function fetchProducts(params?: {
  category?: string;
  q?: string;
}): Promise<Product[]> {
  try {
    const { data } = await apiClient.get<Product[]>('/products', { params });
    return data;
  } catch {
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

export async function updateProduct(
  id: string,
  body: {
    price?: number;
    salePrice?: number | null;
    stock?: number;
    featured?: boolean;
    bestseller?: boolean;
    newArrival?: boolean;
  }
): Promise<Product> {
  const { data } = await apiClient.patch<Product>(`/products/${id}`, body);
  return data;
}
