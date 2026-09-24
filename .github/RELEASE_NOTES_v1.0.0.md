# NOIR Store v1.0.0 — First release

**Date:** 2026-09-24  
**Tag:** `v1.0.0`  
**Commit:** `main`

## What's included

### Shop
- Full product catalogue (T-shirts, hoodies, 3D Lab)
- Local product imagery (24 branded assets)
- Filtering, sorting, search
- Product detail pages with variants
- Cart & wishlist (persisted)
- Checkout + order confirmation
- Order tracking at `/track`

### Ops & quality
- Admin product / order views
- GitHub Actions CI (install + build)
- Vercel deployment support
- CONTRIBUTING guide + README

### Tech
- React 18, Vite 6, TypeScript, Tailwind CSS v4
- Zustand, React Hook Form + Zod, React Router 6
- Optional Express server under `server/`

## Install

```bash
git clone https://github.com/Darrenvandervelde/Merch-Ecommerce-Website.git
cd Merch-Ecommerce-Website
npm install
npm run dev
```

## Demo order tracking

Try `/track` with: `ORD-8K2M9X`, `ORD-4P7Q1A`, `ORD-9R3T2B`, `ORD-2M8K5C`
