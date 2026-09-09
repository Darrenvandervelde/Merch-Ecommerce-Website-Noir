import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getDb, saveDb, findUserByEmail } from '../db.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
}

/** POST /api/auth/register */
router.post('/register', async (req, res) => {
  try {
    const body = registerSchema.parse(req.body);

    if (findUserByEmail(body.email)) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const db = getDb();

    // First user becomes admin for convenience in development
    const role = db.users.length === 0 ? 'admin' : 'customer';

    const user = {
      id: `usr-${Date.now().toString(36)}`,
      email: body.email.toLowerCase(),
      passwordHash,
      firstName: body.firstName,
      lastName: body.lastName,
      role,
      createdAt: new Date().toISOString(),
    };

    db.users.push(user);
    saveDb(db);

    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid input' });
    }
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

/** POST /api/auth/login */
router.post('/login', async (req, res) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = findUserByEmail(body.email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid input' });
    }
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

/** GET /api/auth/me */
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

/** POST /api/auth/logout – client clears token; endpoint for symmetry */
router.post('/logout', requireAuth, (_req, res) => {
  res.json({ message: 'Logged out' });
});

export default router;
