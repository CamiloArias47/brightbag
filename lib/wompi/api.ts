/**
 * URL base de la API Wompi según entorno (sandbox vs producción).
 */
export function getWompiApiBase(): string {
  const pub = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "";
  if (pub.startsWith("pub_test_")) {
    return "https://sandbox.wompi.co/v1";
  }
  return "https://production.wompi.co/v1";
}

export type WompiTransaction = {
  id: string;
  status: string;
  reference: string;
  amount_in_cents?: number;
};

export async function fetchWompiTransaction(
  transactionId: string
): Promise<WompiTransaction | null> {
  const base = getWompiApiBase();
  const url = `${base}/transactions/${encodeURIComponent(transactionId)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    if (!json || typeof json !== "object") return null;
    const o = json as Record<string, unknown>;
    const inner = o.data;
    if (inner && typeof inner === "object") {
      const t = inner as Record<string, unknown>;
      if (typeof t.id === "string" && typeof t.status === "string") {
        return {
          id: t.id,
          status: t.status,
          reference: typeof t.reference === "string" ? t.reference : "",
          amount_in_cents:
            typeof t.amount_in_cents === "number" ? t.amount_in_cents : undefined,
        };
      }
    }
    if (typeof o.id === "string" && typeof o.status === "string") {
      return {
        id: o.id,
        status: o.status,
        reference: typeof o.reference === "string" ? o.reference : "",
        amount_in_cents:
          typeof o.amount_in_cents === "number" ? o.amount_in_cents : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}
