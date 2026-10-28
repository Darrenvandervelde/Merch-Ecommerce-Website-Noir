# Paystack setup (Issue #85)

Code for initialize + verify is already on `main` (`server/lib/paystack.js`, checkout, confirmation).

## What only you can do

1. Create a [Paystack](https://paystack.com/) account (South Africa).  
2. **Test mode** first:
   - Public key → `VITE_PAYSTACK_PUBLIC_KEY` (frontend / Vercel)  
   - Secret key → `PAYSTACK_SECRET_KEY` (API host only - never commit)  
3. Set:
   - `VITE_CURRENCY=ZAR`  
   - `VITE_APP_URL=https://your-live-domain`  
   - `APP_URL` / `CORS_ORIGIN` on the server to the same origin  
4. Place a small **test** payment.  
5. Switch to **live** keys when ready.

## Env checklist

See `.env.example`.

| Variable | Where |
|----------|--------|
| `VITE_PAYSTACK_PUBLIC_KEY` | Vite / Vercel |
| `PAYSTACK_SECRET_KEY` | Node server only |
| `VITE_CURRENCY=ZAR` | Frontend |
| `VITE_APP_URL` | Frontend callback |

Without keys, checkout stays in **demo mode** (order still created when the API is up).
