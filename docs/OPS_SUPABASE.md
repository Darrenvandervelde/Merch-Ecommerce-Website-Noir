# Supabase orders (Issue #86)

## Code status — done on `main`

| Piece | Location |
|-------|----------|
| Schema | `supabase/schema.sql` |
| Upsert helper | `server/lib/supabaseOrders.js` |
| Env template | `.env.example` |
| Local fallback | `server/data/db.json` when env empty |

## What only you can do

1. Create a Supabase project  
2. SQL editor → run `supabase/schema.sql`  
3. Project settings → API → copy URL + **service role** key  
4. On the API host set:
   - `SUPABASE_URL`  
   - `SUPABASE_SERVICE_ROLE_KEY`  
5. Checkout once → confirm a row in `orders`  

Optional later: `products` table + Storage bucket for real product photos.
