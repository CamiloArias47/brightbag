import { NextResponse } from "next/server";
import { verifyWompiEventChecksum } from "@/lib/wompi/verify-event";
import { createAdminClient } from "@/lib/supabase/admin";

type WompiWebhookBody = {
  event: string;
  data: {
    transaction?: {
      id: string;
      reference: string;
      status: string;
      amount_in_cents?: number;
    };
  };
  signature: { properties: string[]; checksum: string };
  timestamp: number;
};

function mapTxStatus(status: string): "pending" | "approved" | "declined" | "voided" {
  switch (status) {
    case "APPROVED":
      return "approved";
    case "DECLINED":
    case "ERROR":
      return "declined";
    case "VOIDED":
      return "voided";
    default:
      return "pending";
  }
}

export async function POST(request: Request) {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing events secret" }, { status: 500 });
  }

  let body: WompiWebhookBody;
  try {
    body = (await request.json()) as WompiWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!verifyWompiEventChecksum(body as Parameters<typeof verifyWompiEventChecksum>[0], secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (body.event !== "transaction.updated") {
    return new NextResponse(null, { status: 200 });
  }

  const tx = body.data?.transaction;
  if (!tx?.reference) {
    return new NextResponse(null, { status: 200 });
  }

  const admin = createAdminClient();
  const orderStatus = mapTxStatus(tx.status);

  const { data: order, error: orderErr } = await admin
    .from("orders")
    .select("id, status")
    .eq("wompi_reference", tx.reference)
    .maybeSingle();

  if (orderErr || !order) {
    return new NextResponse(null, { status: 200 });
  }

  const orderId = order.id as string;
  const previousStatus = order.status as string;

  await admin
    .from("orders")
    .update({
      wompi_transaction_id: tx.id,
      status: orderStatus,
    })
    .eq("id", orderId);

  if (orderStatus === "approved" && previousStatus !== "approved") {
    const { data: items, error: itemsErr } = await admin
      .from("order_items")
      .select("id, variant_id, quantity")
      .eq("order_id", orderId);

    if (!itemsErr && items?.length) {
      for (const row of items) {
        const variantId = row.variant_id as string;
        const qty = Number(row.quantity);
        const { data: v } = await admin
          .from("variants")
          .select("stock")
          .eq("id", variantId)
          .single();
        if (!v) continue;
        const nextStock = Math.max(0, Number(v.stock) - qty);
        await admin.from("variants").update({ stock: nextStock }).eq("id", variantId);
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
