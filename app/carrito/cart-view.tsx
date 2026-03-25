"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SHIPPING_COP } from "@/lib/constants";
import { formatCop } from "@/lib/format";
import { cartSubtotal, useCartStore } from "@/stores/cart-store";

export function CartView() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  const subtotal = cartSubtotal(lines);
  const total = subtotal + SHIPPING_COP;

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Tu carrito está vacío</h1>
        <p className="mt-2 text-muted-foreground">
          Agrega un BrightBag desde la página del producto.
        </p>
        <Link
          href="/producto"
          className={cn(
            buttonVariants({ size: "default" }),
            "btn-luminal-gradient mt-8 inline-flex font-medium"
          )}
        >
          Ir al producto
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Carrito</h1>
      <div className="mt-8 space-y-4">
        {lines.map((line) => (
          <Card key={line.variantId} className="border-0 bg-surface-3/80">
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
              <div>
                <CardTitle className="text-base">{line.productName}</CardTitle>
                <p className="text-sm text-muted-foreground">{line.variantName}</p>
                <p className="text-xs text-muted-foreground">SKU {line.sku}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeLine(line.variantId)}
                aria-label="Quitar"
              >
                <Trash2 className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground" htmlFor={`q-${line.variantId}`}>
                  Cantidad
                </label>
                <input
                  id={`q-${line.variantId}`}
                  type="number"
                  min={1}
                  className="h-9 w-20 rounded-lg border border-input bg-background px-2 text-sm"
                  value={line.quantity}
                  onChange={(e) =>
                    setQuantity(line.variantId, Number.parseInt(e.target.value, 10) || 1)
                  }
                />
              </div>
              <p className="text-sm font-medium">
                {formatCop(line.unitPrice * line.quantity)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-10 border-0 bg-surface-2/80">
        <CardContent className="space-y-2 pt-6 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCop(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Envío (estimado)</span>
            <span>{formatCop(SHIPPING_COP)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-4 text-base font-semibold text-foreground">
            <span>Total</span>
            <span>{formatCop(total)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/producto"
          className={cn(buttonVariants({ variant: "outline" }), "inline-flex justify-center")}
        >
          Seguir comprando
        </Link>
        <Link
          href="/checkout"
          className={cn(
            buttonVariants({ size: "default" }),
            "btn-luminal-gradient inline-flex justify-center font-semibold"
          )}
        >
          Ir a pagar
        </Link>
      </div>
    </div>
  );
}
