-- BrightBag — Supabase schema (run in SQL Editor)
-- Products, variants, orders, order_items

create extension if not exists "uuid-ossp";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  base_price numeric(14,2) not null check (base_price >= 0),
  images text[] not null default '{}',
  attributes jsonb default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sku text not null unique,
  price_override numeric(14,2) check (price_override is null or price_override >= 0),
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  wompi_reference text not null unique,
  wompi_transaction_id text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null default '{}',
  city text not null,
  department text not null,
  total_amount numeric(14,2) not null check (total_amount >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'declined', 'voided')),
  payment_method text not null default 'wompi'
    check (payment_method in ('wompi', 'cod')),
  created_at timestamptz not null default now()
);

create index if not exists orders_wompi_tx_idx on public.orders (wompi_transaction_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid not null references public.variants(id),
  quantity integer not null check (quantity > 0),
  price_at_purchase numeric(14,2) not null check (price_at_purchase >= 0)
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- RLS
alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public read catalog
create policy "products_select_public" on public.products
  for select using (true);

create policy "variants_select_public" on public.variants
  for select using (true);

-- Orders: no public access (server uses service role)
create policy "orders_no_public" on public.orders
  for all using (false);

create policy "order_items_no_public" on public.order_items
  for all using (false);

-- Existing DB: run `supabase/migrations/20260331120000_orders_payment_method.sql` (or equivalent ALTER) in SQL Editor.
