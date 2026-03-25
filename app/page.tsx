import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Moon, Shield, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { getPrimaryProductWithVariants } from "@/lib/queries/catalog";
import { formatCop } from "@/lib/format";
import { variantPriceCOP } from "@/lib/pricing";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Bolso reflectivo`,
  description:
    "Compra el bolso urbano reflectivo BrightBag. Envíos en Colombia, pago seguro con Wompi.",
};

export default async function HomePage() {
  const catalog = await getPrimaryProductWithVariants();
  const product = catalog?.product;
  const variants = catalog?.variants ?? [];
  const fromPrice =
    product && variants.length
      ? Math.min(...variants.map((v) => variantPriceCOP(v, product)))
      : null;
  const heroImg =
    product?.images?.[0] ?? "/images/Gemini_Generated_Image_e0uhy0e0uhy0e0uh.png";

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Luminal Elegance
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Visibilidad que se nota de noche.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground leading-relaxed">
              BrightBag combina material reflectivo de alto contraste con un diseño
              urbano minimalista. Pensado para moverte con seguridad después del
              atardecer.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/producto"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "btn-luminal-gradient gap-2 px-6 font-semibold"
                )}
              >
                Ver producto
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contacto"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-border/80 bg-surface-2/50"
                )}
              >
                Hablar por WhatsApp
              </Link>
            </div>
            {fromPrice != null ? (
              <p className="mt-8 text-sm text-muted-foreground">
                Desde <span className="font-medium text-foreground">{formatCop(fromPrice)}</span>{" "}
                COP · Envío nacional
              </p>
            ) : null}
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface-3 ring-1 ring-white/5">
            <Image
              src={heroImg}
              alt="BrightBag reflectivo"
              fill
              className="object-cover flash-hover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-surface-2/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Por qué BrightBag
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-surface-3/90 p-6 ring-1 ring-white/5">
              <Zap className="size-8 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                Reflectivo real
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Superficie que devuelve la luz de faros y flashes — ideal para
                bicicleta o caminatas nocturnas.
              </p>
            </div>
            <div className="rounded-3xl bg-surface-3/90 p-6 ring-1 ring-white/5">
              <Moon className="size-8 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                Diseño nocturno
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Paleta oscura y contrastes suaves para que el producto luzca premium
                en redes y en persona.
              </p>
            </div>
            <div className="rounded-3xl bg-surface-3/90 p-6 ring-1 ring-white/5">
              <Shield className="size-8 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                Compra segura
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Paga con Wompi (tarjeta, PSE, Nequi y más). Resumen del pedido antes
                de pagar, según la ley colombiana.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 md:flex-row md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Un solo producto, dos tallas
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Elige Mediano o Grande según tu carga diaria. Mismos materiales
              reflectivos, proporciones distintas. Consulta dimensiones en la página
              del producto.
            </p>
          </div>
          <Link
            href="/producto"
            className={cn(
              buttonVariants({ size: "lg" }),
              "btn-luminal-gradient shrink-0 font-semibold"
            )}
          >
            Comprar ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
