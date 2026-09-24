/**
 * Optional Supabase order mirror.
 * When SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set, orders are upserted.
 * Local file DB remains the source of truth for the Express API.
 */

export function isSupabaseConfigured() {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function upsertOrderToSupabase(order) {
  if (!isSupabaseConfigured()) return { skipped: true };

  const url = `${process.env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/orders`;
  const row = {
    id: order.id,
    order_number: order.orderNumber,
    email: order.email,
    user_id: order.userId,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    currency: order.currency || 'ZAR',
    status: order.status,
    payment_status: order.paymentStatus,
    payment_reference: order.paymentReference || null,
    shipping_address: order.shippingAddress,
    delivery_method: order.deliveryMethod,
    created_at: order.createdAt,
    estimated_delivery: order.estimatedDelivery,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[supabase] upsert failed', res.status, text);
    return { ok: false, status: res.status, text };
  }
  return { ok: true };
}
