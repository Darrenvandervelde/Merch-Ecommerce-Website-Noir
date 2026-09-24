# Changelog

All notable changes to the NOIR merch store are documented in this file.

## [1.0.0] — 2026-09-24

### First release

Initial production-ready release of the NOIR premium streetwear e-commerce storefront.

#### Storefront
- Product catalogue: T-shirts, hoodies, and 3D Lab items
- 24 local branded product images (`public/products/`)
- Product detail pages with colour / size variants
- Cart and wishlist with localStorage persistence
- Multi-step checkout (guest checkout supported)
- Order confirmation flow
- Order tracking by order number (`/track`)
- Compare, wishlist, and account-ready routes

#### Platform
- React 18 + Vite 6 + TypeScript + Tailwind CSS
- Zustand stores (cart, wishlist, admin, toasts)
- Express API stubs for auth, products, and orders
- GitHub Actions CI (install + production build)
- Vercel SPA deployment (`vercel.json`)

#### Demo order numbers (tracking)
| Order number | Status |
| --- | --- |
| `ORD-8K2M9X` | processing |
| `ORD-4P7Q1A` | shipped |
| `ORD-9R3T2B` | pending |
| `ORD-2M8K5C` | delivered |

### Install

```bash
npm install
npm run dev
```
