# BrightBag — tienda (Next.js + Supabase + Wompi)

E-commerce para bolso reflectivo: **Next.js 16** (App Router), **Tailwind v4**, **Supabase**, pagos **Wompi** (COP), despliegue recomendado en **Vercel**.

## Requisitos

- Node.js 20+
- Proyecto en [Supabase](https://supabase.com) con tablas creadas
- Cuenta [Wompi](https://comercios.wompi.co/) (sandbox para pruebas)

## Configuración

1. Copia variables de entorno:

   ```bash
   cp .env.example .env.local
   ```

2. En el SQL Editor de Supabase, ejecuta en orden:

   - `supabase/tables.sql`
   - `supabase/seed.sql` (ajusta precios, SKUs e imágenes si lo necesitas)

3. En el dashboard de Wompi (sandbox o producción):

   - Configura la **URL de eventos** apuntando a:  
     `https://TU_DOMINIO/api/webhooks/wompi`
   - Usa el **secreto de eventos** en `WOMPI_EVENTS_SECRET` y el **secreto de integridad** en `WOMPI_INTEGRITY_SECRET`.

4. `NEXT_PUBLIC_SITE_URL` debe ser la URL pública del sitio (en local: `http://localhost:3000`; en Vercel: tu dominio).

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Despliegue (Vercel)

1. Importa el repo en Vercel.
2. Añade las mismas variables de entorno que en `.env.example`.
3. Tras el deploy, actualiza la URL de webhooks en Wompi con `https://tu-proyecto.vercel.app/api/webhooks/wompi`.
4. Prueba el flujo completo en **sandbox** antes de cambiar a llaves `pub_prod_`.

## Estructura relevante

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio (hero, beneficios) |
| `/producto` | PDP, galería, variantes |
| `/carrito` | Carrito (zustand + localStorage) |
| `/checkout` | Envío, resumen legal, Wompi Widget |
| `/checkout/resultado` | Post-pago (query `?id=` transacción Wompi) |
| `/terminos`, `/politica-privacidad`, `/contacto` | Cumplimiento básico CO |

## Documentación Wompi

- [Widget & Checkout](https://docs.wompi.co/docs/colombia/widget-checkout-web/)
- [Eventos / webhooks](https://docs.wompi.co/docs/colombia/eventos/)
