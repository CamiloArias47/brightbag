import { createHash } from "crypto";

/**
 * Firma de integridad Wompi (Colombia):
 * SHA256("<Referencia><MontoEnCentavos>COP<SecretoIntegridad>")
 */
export function wompiIntegrityHex(
  reference: string,
  amountInCents: number,
  integritySecret: string
): string {
  const payload = `${reference}${amountInCents}COP${integritySecret}`;
  return createHash("sha256").update(payload, "utf8").digest("hex");
}
