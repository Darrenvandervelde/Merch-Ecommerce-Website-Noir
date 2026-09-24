import { apiClient } from './client';

/** Paystack public key (safe for the browser). */
export function getPaystackPublicKey(): string {
  return import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
}

export function isPaystackConfigured(): boolean {
  return Boolean(getPaystackPublicKey());
}

export function getStoreCurrency(): string {
  return import.meta.env.VITE_CURRENCY || 'ZAR';
}

export interface PaymentConfig {
  provider: string;
  configured: boolean;
  publicKey: string;
  currency: string;
}

export async function fetchPaymentConfig(): Promise<PaymentConfig> {
  try {
    const { data } = await apiClient.get<PaymentConfig>('/payments/config');
    return data;
  } catch {
    return {
      provider: 'paystack',
      configured: isPaystackConfigured(),
      publicKey: getPaystackPublicKey(),
      currency: getStoreCurrency(),
    };
  }
}

export interface InitializePaymentResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
  orderId: string;
  orderNumber: string;
}

export async function initializePaystackPayment(
  orderId: string,
  callbackUrl?: string
): Promise<InitializePaymentResult> {
  const { data } = await apiClient.post<InitializePaymentResult>(
    '/payments/paystack/initialize',
    { orderId, callbackUrl }
  );
  return data;
}

export interface VerifyPaymentResult {
  paid: boolean;
  reference: string;
  amount?: number;
  currency?: string;
  order: {
    id: string;
    orderNumber: string;
    paymentStatus: string;
    status: string;
    total: number;
  } | null;
}

export async function verifyPaystackPayment(
  reference: string
): Promise<VerifyPaymentResult> {
  const { data } = await apiClient.get<VerifyPaymentResult>(
    '/payments/paystack/verify',
    { params: { reference } }
  );
  return data;
}

/** Legacy Stripe helpers (kept for compatibility). */
export function getStripePublicKey(): string {
  return import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
}

export function isStripeConfigured(): boolean {
  return Boolean(getStripePublicKey());
}
