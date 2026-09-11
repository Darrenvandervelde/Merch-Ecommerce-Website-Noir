# NOIR: Premium Streetwear E-Commerce

Production-ready merchandise store for hoodies and T-shirts built with React, Vite, TypeScript, Tailwind CSS, Zustand, React Hook Form + Zod, and React Router.

## Features

- Premium streetwear design system
- Full product catalogue (16 products) with filtering, sorting, and search
- Product detail pages with variant selection (colour + size required)
- Shopping cart with localStorage persistence and stock checks
- Wishlist with localStorage persistence
- Multi-step checkout with validation (React Hook Form + Zod)
- Order confirmation flow
- Mobile-first responsive navigation with drawer
- Lazy-loaded routes & code splitting
- Toast notifications
- SEO-friendly URLs, robots.txt, sitemap.xml
- Accessibility-focused components
- Environment-variable driven configuration
- Stripe-ready payment architecture (no raw card storage)
- Auth-ready account structure
- Clean, scalable folder architecture

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 6**
- **React Router 6**
- **Tailwind CSS v4**
- **Zustand** (cart + wishlist + toasts)
- **React Hook Form** + **Zod**
- **Lucide React** (icons)
- **Axios** (API client ready)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Environment Variables

See `.env.example`:

```
VITE_API_URL=
VITE_STRIPE_PUBLIC_KEY=
VITE_APP_NAME=NOIR
```

Never commit `.env`. Only public keys belong in the frontend.

## Project Structure

```
src/
├── api/              # API client layer (ready for backend)
├── components/
│   ├── common/       # Button, Toast, etc.
│   ├── layout/       # Header, Footer
│   ├── products/     # ProductCard, ProductGrid
│   ├── cart/
│   ├── checkout/
│   └── forms/
├── data/             # Mock product catalogue
├── hooks/
├── layouts/
├── pages/            # All route pages
├── store/            # Zustand stores
├── types/
├── utils/
└── routes/
```

## Key Behaviours

- Users **must** select colour and size before adding to cart
- Cart and wishlist survive page refreshes
- Quantity cannot exceed available stock
- Free shipping threshold: $100 (demo logic)
- Payment section is structured for Stripe – no card data is stored client-side

## Deployment

Works with **Vercel**, **Netlify**, and **Cloudflare Pages**.

### SPA Routing

For Vercel create `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

For Netlify create `public/_redirects`:

```
/*    /index.html   200
```

For Cloudflare Pages use the SPA fallback setting or a `_redirects` file.

## Backend / API Requirements

The frontend is ready to connect to a real backend. Replace mock data in `src/data/products.ts` and the API stubs in `src/api/` with real endpoints.

Recommended backend endpoints:

- `GET /products`
- `GET /products/:slug`
- `POST /orders`
- `POST /auth/login`, `/auth/register`
- `GET /account/orders`

Never trust client-side prices or stock – always re-validate on the server.

## Payment Integration

1. Create a Stripe account
2. Add your **publishable** key to `VITE_STRIPE_PUBLIC_KEY`
3. Implement the client-side Stripe Elements / Checkout Session flow
4. Handle webhooks on your backend for order confirmation

Never handle or store raw card numbers in this application.

## Production Checklist

- [ ] `npm install` succeeds
- [ ] `npm run build` succeeds
- [ ] All routes work (including refresh)
- [ ] Cart persists after refresh
- [ ] Variant selection required for add-to-cart
- [ ] Forms validate correctly
- [ ] Environment variables documented
- [ ] Secrets not committed
- [ ] SPA fallback configured for hosting
- [ ] Images have alt text
- [ ] Mobile navigation works

## License

MIT
