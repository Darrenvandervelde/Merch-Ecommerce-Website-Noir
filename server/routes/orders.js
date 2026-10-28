import { Router } from 'express';
import { z } from 'zod';
import { getDb, saveDb } from '../db.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { upsertOrderToSupabase } from '../lib/supabaseOrders.js';

const router = Router();

const createOrderSchema = z.object({
  email: z.string().email(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        colour: z.string(),
        size: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address1: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().optional(),
  }),
  deliveryMethod: z.enum(['standard', 'express']).default('standard'),
  currency: z.string().default('ZAR'),
  /** When true, mark paid immediately (demo / offline). Default false for Paystack flow. */
  simulatePaid: z.boolean().optional(),
});

/** POST /api/orders - create order (re-validates prices & stock on server) */
router.post('/', optionalAuth, async (req, res) => {
  try {
    const body = createOrderSchema.parse(req.body);
    const db = getDb();

    const lineItems = [];
    let subtotal = 0;

    for (const item of body.items) {
      const product = db.products.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }
      if (!product.colours.includes(item.colour) || !product.sizes.includes(item.size)) {
        return res.status(400).json({ message: `Invalid variant for ${product.name}` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }

      const unit = product.salePrice ?? product.price;
      subtotal += unit * item.quantity;

      lineItems.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0] || '',
        price: product.price,
        salePrice: product.salePrice,
        colour: item.colour,
        size: item.size,
        quantity: item.quantity,
        maxStock: product.stock,
      });

      product.stock -= item.quantity;
    }

    const currency = body.currency || process.env.CURRENCY || 'ZAR';
    const shipping =
      body.deliveryMethod === 'express' ? 18 : subtotal >= 100 ? 0 : 8;
    // SA VAT 15% when currency is ZAR; keep 8% demo tax for other currencies
    const taxRate = currency === 'ZAR' ? 0.15 : 0.08;
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    const simulatePaid = body.simulatePaid === true;
    const order = {
      id: `ord-${Date.now().toString(36)}`,
      orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}`,
      email: body.email,
      userId: req.user?.id || null,
      items: lineItems,
      subtotal,
      shipping,
      tax,
      total,
      currency,
      status: simulatePaid ? 'processing' : 'pending',
      paymentStatus: simulatePaid ? 'paid' : 'pending',
      shippingAddress: body.shippingAddress,
      deliveryMethod: body.deliveryMethod,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString().slice(0, 10),
    };

    db.orders.push(order);
    saveDb(db);
    await upsertOrderToSupabase(order);

    res.status(201).json(order);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid input' });
    }
    console.error(err);
    res.status(500).json({ message: 'Could not create order' });
  }
});

/**
 * GET /api/orders/track/:orderNumber - public tracking (limited fields)
 * Must be registered before /:id routes that require auth.
 */
router.get('/track/:orderNumber', (req, res) => {
  const db = getDb();
  const q = String(req.params.orderNumber || '').trim().toUpperCase();
  const order = db.orders.find(
    (o) =>
      String(o.orderNumber).toUpperCase() === q ||
      String(o.id).toUpperCase() === q
  );
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    estimatedDelivery: order.estimatedDelivery,
    itemCount: order.items?.length ?? 0,
    currency: order.currency || 'ZAR',
    total: order.total,
  });
});

/** GET /api/orders - admin: all orders; user: own orders */
router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  if (req.user.role === 'admin') {
    return res.json(db.orders);
  }
  const mine = db.orders.filter(
    (o) => o.userId === req.user.id || o.email === req.user.email
  );
  res.json(mine);
});

/** GET /api/orders/:id */
router.get('/:id', requireAuth, (req, res) => {
  const db = getDb();
  const order = db.orders.find(
    (o) => o.id === req.params.id || o.orderNumber === req.params.id
  );
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (
    req.user.role !== 'admin' &&
    order.userId !== req.user.id &&
    order.email !== req.user.email
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
});

/** PATCH /api/orders/:id/status - admin */
router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { status, paymentStatus } = req.body;
  const db = getDb();
  const idx = db.orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (status) db.orders[idx].status = status;
  if (paymentStatus) db.orders[idx].paymentStatus = paymentStatus;
  saveDb(db);
  await upsertOrderToSupabase(db.orders[idx]);
  res.json(db.orders[idx]);
});

export default router;
