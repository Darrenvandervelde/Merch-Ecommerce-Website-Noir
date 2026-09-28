/**
 * Paystack server helpers (South Africa / multi-currency).
 * Secret key must only live on the server (PAYSTACK_SECRET_KEY).
 */

const PAYSTACK_BASE = 'https://api.paystack.co';

export function getPaystackSecret() {
  return process.env.PAYSTACK_SECRET_KEY || '';
}

export function isPaystackConfigured() {
  return Boolean(getPaystackSecret());
}

/** Amount in major units (e.g. R199.50) → smallest currency unit */
export function toMinorUnits(amount, currency = 'ZAR') {
  const n = Number(amount);
  if (!Number.isFinite(n) || n < 0) return 0;
  // Most Paystack currencies use 2 decimal places
  return Math.round(n * 100);
}

export async function paystackRequest(path, options = {}) {
  const secret = getPaystackSecret();
  if (!secret) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured');
  }

  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status === false) {
    const msg = data.message || `Paystack error (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.paystack = data;
    throw err;
  }
  return data;
}

/**
 * Initialize a transaction. Customer is redirected to authorization_url.
 * @see https://paystack.com/docs/api/transaction/#initialize
 */
export async function initializeTransaction({
  email,
  amount,
  currency = 'ZAR',
  reference,
  callback_url,
  metadata = {},
}) {
  return paystackRequest('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email,
      amount: toMinorUnits(amount, currency),
      currency,
      reference,
      callback_url,
      metadata,
    }),
  });
}

export async function verifyTransaction(reference) {
  return paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
  });
}
