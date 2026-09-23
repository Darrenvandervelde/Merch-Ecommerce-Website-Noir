# Settings & data layout

## Files

| File | Purpose |
|------|--------|
| `settings.ini` | Human-editable store config (docs + non-dev friendly) |
| `src/data/settings.json` | Same values as JSON for the app runtime |
| `src/config/settings.ts` | Typed helpers (`getFreeShippingThreshold`, etc.) |
| `src/data/products.ts` | Current product catalogue (TypeScript) |
| `src/data/products.catalog.json` | Marker for JSON-first catalogue migration |

## How to change free shipping

1. Update `settings.ini` → `[app] free_shipping_threshold`
2. Mirror the value in `src/data/settings.json` → `app.freeShippingThreshold`
3. Import from `src/config/settings.ts` in cart / checkout code

## Why both INI and JSON?

- **INI** — easy for non-code edits and deployment notes
- **JSON** — first-class in the Vite/React bundle with types

Keep them in sync when you change a value.
