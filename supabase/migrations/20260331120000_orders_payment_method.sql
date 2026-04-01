-- Add payment_method for Wompi vs pago contra entrega (existing DBs only).
-- Safe to run multiple times: column skipped if already present.
alter table public.orders
  add column if not exists payment_method text not null default 'wompi'
    check (payment_method in ('wompi', 'cod'));
