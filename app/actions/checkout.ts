"use server";

import { SHIPPING_COP } from "@/lib/constants";
import type { ProductRow, VariantRow } from "@/lib/types/database";
import { copToAmountInCents } from "@/lib/wompi/amount";
import { wompiIntegrityHex } from "@/lib/wompi/integrity";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPrimaryProductWithVariants } from "@/lib/queries/catalog";
import { variantPriceCOP } from "@/lib/pricing";
import type { CartLine } from "@/stores/cart-store";
import { randomUUID } from "crypto";
import {
  checkoutFormSchema,
  type CheckoutFormSchema,
} from "@/lib/validations/checkout";

export type CheckoutFormValues = CheckoutFormSchema;

export type PrepareCheckoutInput = CheckoutFormSchema & {
  lines: CartLine[];
};

export type PrepareCheckoutResult =
  | {
      ok: true;
      reference: string;
      amountInCents: number;
      integrity: string;
      publicKey: string;
      redirectUrl: string;
    }
  | { ok: false; error: string };

export type SubmitCodOrderResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

type ValidatedCart =
  | { ok: false; error: string }
  | {
      ok: true;
      data: CheckoutFormSchema;
      lines: CartLine[];
      totalCop: number;
      variantMap: Map<string, VariantRow>;
      product: ProductRow;
    };

function shortRef(prefix: string): string {
  return `${prefix}-${randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

async function validateCheckoutCart(
  input: PrepareCheckoutInput
): Promise<ValidatedCart> {
  const parsed = checkoutFormSchema.safeParse(input);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { ok: false, error: msg };
  }

  const { lines } = input;
  if (!lines.length) {
    return { ok: false, error: "Tu carrito está vacío" };
  }

  const catalog = await getPrimaryProductWithVariants();
  if (!catalog) {
    return { ok: false, error: "No se pudo cargar el catálogo." };
  }

  const { product, variants } = catalog;
  const variantMap = new Map(variants.map((v) => [v.id, v]));

  let subtotal = 0;
  for (const line of lines) {
    const v = variantMap.get(line.variantId);
    if (!v || v.product_id !== product.id) {
      return { ok: false, error: "El carrito contiene variantes inválidas." };
    }
    if (line.quantity < 1 || line.quantity > v.stock) {
      return {
        ok: false,
        error: `Cantidad no disponible para ${v.name}.`,
      };
    }
    const price = variantPriceCOP(v, product);
    subtotal += price * line.quantity;
  }

  const totalCop = subtotal + SHIPPING_COP;

  return {
    ok: true,
    data: parsed.data,
    lines,
    totalCop,
    variantMap,
    product,
  };
}

async function persistOrder(
  validated: Extract<ValidatedCart, { ok: true }>,
  reference: string,
  paymentMethod: "wompi" | "cod"
): Promise<{ ok: true; orderId: string } | { ok: false; error: string }> {
  const { data, lines, totalCop, variantMap, product } = validated;

  const shippingAddress = {
    line1: data.addressLine1,
    line2: data.addressLine2 ?? "",
    country: "CO",
  };

  const admin = createAdminClient();

  const { data: orderRow, error: orderError } = await admin
    .from("orders")
    .insert({
      wompi_reference: reference,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      shipping_address: shippingAddress,
      city: data.city,
      department: data.department,
      total_amount: totalCop,
      status: "pending",
      payment_method: paymentMethod,
    })
    .select("id")
    .single();

  if (orderError || !orderRow) {
    console.error(orderError);
    return { ok: false, error: "No se pudo crear el pedido. Intenta de nuevo." };
  }

  const orderId = orderRow.id as string;

  const items = lines.map((line) => {
    const v = variantMap.get(line.variantId)!;
    const price = variantPriceCOP(v, product);
    return {
      order_id: orderId,
      variant_id: line.variantId,
      quantity: line.quantity,
      price_at_purchase: price,
    };
  });

  const { error: itemsError } = await admin.from("order_items").insert(items);
  if (itemsError) {
    console.error(itemsError);
    await admin.from("orders").delete().eq("id", orderId);
    return { ok: false, error: "No se pudo guardar los ítems del pedido." };
  }

  return { ok: true, orderId };
}

export async function prepareCheckout(
  input: PrepareCheckoutInput
): Promise<PrepareCheckoutResult> {
  const validated = await validateCheckoutCart(input);
  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
  if (!integritySecret || !publicKey) {
    return {
      ok: false,
      error: "Configuración de pagos incompleta (Wompi).",
    };
  }

  const reference = shortRef("BB");
  const amountInCents = copToAmountInCents(validated.totalCop);

  const persisted = await persistOrder(validated, reference, "wompi");
  if (!persisted.ok) {
    return { ok: false, error: persisted.error };
  }

  const integrity = wompiIntegrityHex(reference, amountInCents, integritySecret);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const redirectUrl = `${baseUrl.replace(/\/$/, "")}/checkout/resultado`;

  return {
    ok: true,
    reference,
    amountInCents,
    integrity,
    publicKey,
    redirectUrl,
  };
}

export async function submitCodOrder(
  input: PrepareCheckoutInput
): Promise<SubmitCodOrderResult> {
  const validated = await validateCheckoutCart(input);
  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  const reference = shortRef("COD");
  const persisted = await persistOrder(validated, reference, "cod");
  if (!persisted.ok) {
    return { ok: false, error: persisted.error };
  }

  return { ok: true, reference };
}
