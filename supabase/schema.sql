-- NOIR v2 — optional Supabase schema for production orders
-- Run in the Supabase SQL editor when you are ready to leave file-based db.json

create table if not exists public.orders (
  id text primary key,
  order_number text unique not null,
  email text not null,
  user_id text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  shipping numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  currency text not null default 'ZAR',
  status text not null default 'pending',
  payment_status text not null default 'pending',
  payment_reference text,
  shipping_address jsonb,
  delivery_method text,
  created_at timestamptz not null default now(),
  estimated_delivery date,
  paid_at timestamptz
);

create index if not exists orders_email_idx on public.orders (email);
create index if not exists orders_payment_reference_idx on public.orders (payment_reference);

-- Public tracking by order number can be exposed via a security-definer function later.
-- For v2 the Express API remains the public track endpoint.
