import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import { ClearCartOnConfirmado } from "./clear-cart";

export const metadata: Metadata = {
  title: `Pedido confirmado | ${SITE_NAME}`,
};

export default async function ConfirmadoPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <ClearCartOnConfirmado />
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">
        Pago contra entrega
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        ¡Pedido recibido!
      </h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Recibirás la confirmación por correo. El pago se realizará en efectivo al
        momento de la entrega. Te contactaremos si necesitamos datos adicionales.
      </p>
      {ref ? (
        <p className="mt-6 break-all text-xs text-muted-foreground">
          Referencia del pedido: {ref}
        </p>
      ) : null}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "inline-flex justify-center"
          )}
        >
          Volver al inicio
        </Link>
        <Link
          href="/producto"
          className={cn(
            buttonVariants({ size: "default" }),
            "btn-luminal-gradient inline-flex justify-center font-semibold"
          )}
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
