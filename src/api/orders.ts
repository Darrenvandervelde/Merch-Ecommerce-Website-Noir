import { apiClient } from './client';
import type { ShippingAddress } from '../types';

export interface CreateOrderPayload {
  email: string;
  items: Array<{
    productId: string;
    colour: string;
    size: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  deliveryMethod: string;
  currency?: string;
  /** Demo path when Paystack is not available */
  simulatePaid?: boolean;
}

export async function createOrder(payload: CreateOrderPayload) {
  const { data } = await apiClient.post('/orders', payload);
  return data;
}

export async function fetchOrders() {
  const { data } = await apiClient.get('/orders');
  return data;
}

export async function updateOrderStatus(
  id: string,
  body: { status?: string; paymentStatus?: string }
) {
  const { data } = await apiClient.patch(`/orders/${id}/status`, body);
  return data;
}

/** Public tracking (no auth) */
export async function trackOrder(orderNumber: string) {
  const { data } = await apiClient.get(
    `/orders/track/${encodeURIComponent(orderNumber)}`
  );
  return data;
}
