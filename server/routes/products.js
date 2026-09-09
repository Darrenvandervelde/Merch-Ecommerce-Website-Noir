import { Router } from 'express';
import { z } from 'zod';
import { getDb, saveDb } from '../db.js';
import { optionalAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

/** GET /api/products */
router.get('/', optionalAuth, (req, res) => {
  const db = getDb();
  let list = [...db.products];

  const { category, q } = req.query;
  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }
  if (q) {
    const term = String(q).toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  res.json(list);
});

/** GET /api/products/:slug */
router.get('/:slug', optionalAuth, (req, res) => {
  const db = getDb();
  const product = db.products.find((p) => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

const priceSchema = z.object({
  price: z.number().positive(),
  salePrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  bestseller: z.boolean().optional(),
  newArrival: z.boolean().optional(),
});

/** PATCH /api/products/:id – admin update price/stock/flags */
router.patch('/:id', requireAdmin, (req, res) => {
  try {
    const body = priceSchema.parse(req.body);
    const db = getDb();
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = { ...db.products[idx] };
    if (body.price !== undefined) product.price = body.price;
    if (body.salePrice === null) {
      delete product.salePrice;
    } else if (body.salePrice !== undefined) {
      product.salePrice = body.salePrice;
    }
    if (body.stock !== undefined) product.stock = body.stock;
    if (body.featured !== undefined) product.featured = body.featured;
    if (body.bestseller !== undefined) product.bestseller = body.bestseller;
    if (body.newArrival !== undefined) product.newArrival = body.newArrival;

    db.products[idx] = product;
    saveDb(db);
    res.json(product);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid input' });
    }
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
});

export default router;
