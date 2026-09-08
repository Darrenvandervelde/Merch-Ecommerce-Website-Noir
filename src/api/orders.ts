import { apiClient } from './client';
import type { Order, CartItem, ShippingAddress } from '../types';

export interface CreateOrderPayload {
  email: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: string;
  // Never send raw card data – only a payment intent / session id from Stripe
  paymentIntentId?: string;
}

/**
 * Create an order on the backend.
 * Backend must re-validate prices and stock.
 */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiClient.post<Order>('/orders', payload);
  return data;
}

export async function fetchOrder(orderId: string): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/orders/${orderId}`);
  return data;
}
