"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatCop } from "@/lib/format";
import { variantPriceCOP } from "@/lib/pricing";
import type { ProductRow, VariantRow } from "@/lib/types/database";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";

type Props = {
  product: ProductRow;
  variants: VariantRow[];
};

export function AddToCart({ product, variants }: Props) {
  const router = useRouter();
  const addLine = useCartStore((s) => s.addLine);
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");

  const selected = variants.find((v) => v.id === variantId);
  const price = selected
    ? variantPriceCOP(selected, product)
    : Number(product.base_price);

  const handleAdd = () => {
    if (!selected) return;
    if (selected.stock < 1) return;
    addLine({
      variantId: selected.id,
      productId: product.id,
      productName: product.name,
      variantName: selected.name,
      sku: selected.sku,
      unitPrice: price,
      quantity: 1,
    });
    router.push("/carrito");
  };

  if (!variants.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay variantes disponibles por ahora.
      </p>
    );
  }

  return (
    <Card className="border-0 bg-surface-3/80">
      <CardHeader>
        <CardTitle className="text-lg">Elige tu talla</CardTitle>
        <CardDescription>
          Dimensiones indicadas en la ficha. Stock sujeto a disponibilidad.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="variant">Variante</Label>
          <select
            id="variant"
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id} disabled={v.stock < 1}>
                {v.name} — {formatCop(variantPriceCOP(v, product))}{" "}
                {v.stock < 1 ? "(Agotado)" : `(${v.stock} disp.)`}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-muted-foreground">Precio</span>
          <span className="text-xl font-semibold tracking-tight">
            {formatCop(price)}
          </span>
        </div>
        <Button
          className="btn-luminal-gradient w-full font-medium"
          size="lg"
          disabled={!selected || selected.stock < 1}
          onClick={handleAdd}
        >
          Agregar al carrito
        </Button>
      </CardContent>
    </Card>
  );
}
