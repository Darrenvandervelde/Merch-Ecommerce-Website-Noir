import { Router } from 'express';
import { z } from 'zod';
import { getDb, saveDb } from '../db.js';
import {
  initializeTransaction,
  verifyTransaction,
  isPaystackConfigured,
} from '../lib/paystack.js';
import { upsertOrderToSupabase } from '../lib/supabaseOrders.js';

const router = Router();

const initSchema = z.object({
  orderId: z.string().min(1),
  callbackUrl: z.string().url().optional(),
});

/** GET /api/payments/config – public flags for the storefront */
router.get('/config', (_req, res) => {
  res.json({
    provider: 'paystack',
    configured: isPaystackConfigured(),
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || process.env.VITE_PAYSTACK_PUBLIC_KEY || '',
    currency: process.env.CURRENCY || 'ZAR',
  });
});

/**
 * POST /api/payments/paystack/initialize
 * Creates a Paystack transaction for an existing pending order.
 */
router.post('/paystack/initialize', async (req, res) => {
  try {
    if (!isPaystackConfigured()) {
      return res.status(503).json({
        message:
          'Paystack is not configured. Set PAYSTACK_SECRET_KEY on the server.',
      });
    }

    const body = initSchema.parse(req.body);
    const db = getDb();
    const order = db.orders.find(
      (o) => o.id === body.orderId || o.orderNumber === body.orderId
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    const reference = order.paymentReference || `noir_${order.id}_${Date.now()}`;
    order.paymentReference = reference;
    order.paymentStatus = 'pending';
    saveDb(db);

    const appUrl =
      process.env.APP_URL ||
      process.env.CORS_ORIGIN ||
      'http://localhost:5173';
    const callback_url =
      body.callbackUrl ||
      `${String(appUrl).replace(/\/$/, '')}/order-confirmation/${order.orderNumber}`;

    const currency = order.currency || process.env.CURRENCY || 'ZAR';
    const result = await initializeTransaction({
      email: order.email,
      amount: order.total,
      currency,
      reference,
      callback_url,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    res.json({
      authorizationUrl: result.data.authorization_url,
      accessCode: result.data.access_code,
      reference: result.data.reference,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid input' });
    }
    console.error('[payments] initialize', err);
    res.status(err.status || 500).json({ message: err.message || 'Payment init failed' });
  }
});

/**
 * GET /api/payments/paystack/verify?reference=
 * Confirm payment with Paystack and mark the order paid.
 */
router.get('/paystack/verify', async (req, res) => {
  try {
    const reference = String(req.query.reference || '');
    if (!reference) {
      return res.status(400).json({ message: 'reference is required' });
    }
    if (!isPaystackConfigured()) {
      return res.status(503).json({ message: 'Paystack is not configured' });
    }

    const result = await verifyTransaction(reference);
    const data = result.data;
    const paid = data.status === 'success';

    const db = getDb();
    let order = db.orders.find(
      (o) =>
        o.paymentReference === reference ||
        o.id === data.metadata?.orderId ||
        o.orderNumber === data.metadata?.orderNumber
    );

    if (order && paid) {
      order.paymentStatus = 'paid';
      if (order.status === 'pending') order.status = 'processing';
      order.paidAt = new Date().toISOString();
      order.paymentChannel = data.channel;
      saveDb(db);
      await upsertOrderToSupabase(order);
    }

    res.json({
      paid,
      reference,
      amount: data.amount,
      currency: data.currency,
      order: order
        ? {
            id: order.id,
            orderNumber: order.orderNumber,
            paymentStatus: order.paymentStatus,
            status: order.status,
            total: order.total,
          }
        : null,
    });
  } catch (err) {
    console.error('[payments] verify', err);
    res.status(err.status || 500).json({ message: err.message || 'Verify failed' });
  }
});

export default router;
