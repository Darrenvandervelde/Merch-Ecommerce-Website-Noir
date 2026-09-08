/**
 * Payment helpers – Stripe ready.
 *
 * Frontend responsibilities:
 * - Load Stripe.js with the public key from VITE_STRIPE_PUBLIC_KEY
 * - Create a PaymentIntent or Checkout Session via your backend
 * - Confirm payment on the client
 *
 * Backend responsibilities:
 * - Create PaymentIntent / Session with the real amount (never trust client)
 * - Verify webhooks
 * - Mark order as paid
 *
 * NEVER send or store raw card numbers from this application.
 */

export function getStripePublicKey(): string {
  return import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
}

export function isStripeConfigured(): boolean {
  return Boolean(getStripePublicKey());
}

// Example shape for a future Checkout Session response from your backend
export interface CheckoutSessionResponse {
  sessionId: string;
  url?: string; // for Stripe Checkout redirect
}
