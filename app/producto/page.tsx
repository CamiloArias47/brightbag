import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductGallery } from "@/components/product/product-gallery";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { getPrimaryProductWithVariants } from "@/lib/queries/catalog";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Producto | ${SITE_NAME}`,
  description:
    "Bolso reflectivo BrightBag — dimensiones reales, visibilidad nocturna y envíos en Colombia.",
};

export default async function ProductoPage() {
  const data = await getPrimaryProductWithVariants();

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Catálogo no disponible</h1>
        <p className="mt-2 text-muted-foreground">
          Configura Supabase y ejecuta el seed SQL, o revisa tu conexión.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "mt-6 inline-flex")}
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const { product, variants } = data;
  const attrs = product.attributes as {
    dimensions?: { width_cm: number; height_cm: number; depth_cm: number };
    material?: string;
    care?: string;
  } | null;

  const dims = attrs?.dimensions;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        <ProductGallery images={product.images} alt={product.name} />
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              BrightBag
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              {product.name}
            </h1>
            {product.description ? (
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            ) : null}
          </div>

          {dims ? (
            <div className="rounded-2xl bg-surface-3/80 p-4 text-sm">
              <p className="font-medium text-foreground">Dimensiones reales (aprox.)</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>Ancho: {dims.width_cm} cm</li>
                <li>Alto: {dims.height_cm} cm</li>
                <li>Fondo: {dims.depth_cm} cm</li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Las medidas corresponden al producto físico; las fotos pueden incluir
                composición creativa. Consulta dudas por WhatsApp.
              </p>
            </div>
          ) : null}

          {attrs?.material ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Material: </span>
              {attrs.material}
            </p>
          ) : null}

          <AddToCart product={product} variants={variants} />
        </div>
      </div>
    </div>
  );
}
