import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { fetchWompiTransaction } from "@/lib/wompi/api";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import { ClearCartOnApproved } from "./clear-cart";

export const metadata: Metadata = {
  title: `Resultado del pago | ${SITE_NAME}`,
};

export default async function ResultadoPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const tx = id ? await fetchWompiTransaction(id) : null;
  const status = tx?.status ?? null;

  let title = "Estamos procesando tu pago";
  let message =
    "Si acabas de pagar, tu banco puede tardar unos segundos. También te notificaremos por correo cuando el webhook confirme el estado.";
  let tone: "ok" | "warn" | "err" = "warn";

  if (status === "APPROVED") {
    title = "¡Pago aprobado!";
    message =
      "Gracias por tu compra. Recibirás la confirmación por correo y prepararemos tu envío.";
    tone = "ok";
  } else if (status === "DECLINED" || status === "ERROR") {
    title = "Pago no completado";
    message =
      "La transacción no fue aprobada. Puedes intentar de nuevo con otro medio de pago.";
    tone = "err";
  } else if (status === "VOIDED") {
    title = "Transacción anulada";
    message = "Esta transacción fue anulada. Si tienes dudas, escríbenos por WhatsApp.";
    tone = "err";
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <ClearCartOnApproved status={status} />
      <p
        className={cn(
          "text-xs font-medium uppercase tracking-[0.12em]",
          tone === "ok" && "text-primary",
          tone === "warn" && "text-muted-foreground",
          tone === "err" && "text-destructive"
        )}
      >
        Resultado
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">{message}</p>
      {id ? (
        <p className="mt-6 break-all text-xs text-muted-foreground">
          Referencia de transacción Wompi: {id}
        </p>
      ) : null}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "inline-flex justify-center")}
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
      <p className="mt-10 text-xs text-muted-foreground">
        La redirección es solo informativa. El comercio confirma el pago mediante el
        webhook de Wompi.
      </p>
    </div>
  );
}
