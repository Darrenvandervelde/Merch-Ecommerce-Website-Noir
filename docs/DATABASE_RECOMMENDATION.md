# Database research — NOIR store (Issue #5)

## Requirement

Store **product data + images**, with **role-based access**:

| Role | Access |
|------|--------|
| Admin | Full read/write |
| Analyst | **Read-only** (no edit/delete) |

## Recommendation for this project

**Primary: Supabase (Postgres) + Supabase Storage**

| Need | Solution |
|------|----------|
| Product tables, orders, stock | Postgres via Supabase |
| Product images / 3D assets | Supabase Storage (or Cloudflare R2) |
| Admin vs analyst | Row Level Security + roles |
| SA / low ops cost | Free tier → paid as you grow |
| Already in repo | `supabase/schema.sql` + `server/lib/supabaseOrders.js` |

### Why not only the alternatives?

| Option | Verdict |
|--------|---------|
| **MongoDB Atlas** | Fine for documents; image files still need S3/R2; RLS is weaker than Postgres policies |
| **Neon** | Excellent Postgres; you still need a separate file store |
| **Firebase** | Fast to start; vendor lock-in; less ideal for relational stock/orders |
| **AWS S3 alone** | Files only — still need a DB |
| **Self-hosted** | Full control, highest ops cost |

### Target architecture

```
Browser → Express API → Postgres (products, orders, stock)
                      ↘ Storage (images) with public read URLs
Analyst → Supabase read-only role (SELECT only)
Admin   → service role / admin JWT (full access)
```

### Next steps when you go live

1. Create a Supabase project  
2. Run `supabase/schema.sql` (extend with `products` table when ready)  
3. Create a Storage bucket `product-images` (public read)  
4. Set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` on the API host only  
5. Keep `db.json` for local demo when env is empty  

**Decision:** use **Supabase** as the default production database + file layer for NOIR.
