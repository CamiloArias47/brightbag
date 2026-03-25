-- Seed de ejemplo: bolso reflectivo, dos tallas. Ajusta precios e imágenes.
-- Ejecutar después de tables.sql. Las URLs de imágenes apuntan a /public en desarrollo
-- o reemplaza por URLs de Supabase Storage.

insert into public.products (id, name, description, base_price, images, attributes)
values (
  '00000000-0000-4000-8000-000000000001',
  'BrightBag Reflectivo',
  'Bolso urbano de alta visibilidad con material reflectivo. Ideal para ciclistas y desplazamientos nocturnos.',
  149900,
  array[
    '/images/Gemini_Generated_Image_e0uhy0e0uhy0e0uh.png',
    '/images/Gemini_Generated_Image_lk627vlk627vlk62.png'
  ],
  jsonb_build_object(
    'dimensions', jsonb_build_object('width_cm', 32, 'height_cm', 38, 'depth_cm', 12),
    'material', 'Poliéster reflectivo y forro interior',
    'care', 'Limpiar con paño húmedo, no usar secadora'
  )
)
on conflict (id) do nothing;

insert into public.variants (id, product_id, name, sku, price_override, stock)
values
  (
    '10000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    'Mediano - Reflectivo',
    'BB-MED-REF',
    null,
    25
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000001',
    'Grande - Reflectivo',
    'BB-GRA-REF',
    169900,
    20
  )
on conflict (sku) do update set
  name = excluded.name,
  price_override = excluded.price_override,
  stock = excluded.stock;
