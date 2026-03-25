import { createHash } from "crypto";

type WompiEventBody = {
  event: string;
  data: Record<string, unknown>;
  signature: {
    properties: string[];
    checksum: string;
  };
  timestamp: number;
};

function getNestedValue(obj: unknown, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const p of parts) {
    if (current === null || current === undefined) return "";
    current = (current as Record<string, unknown>)[p];
  }
  if (current === null || current === undefined) return "";
  return String(current);
}

/**
 * Valida el checksum del webhook según documentación Wompi (eventos).
 */
export function verifyWompiEventChecksum(
  body: WompiEventBody,
  eventsSecret: string
): boolean {
  const { signature, timestamp, data } = body;
  if (!signature?.properties?.length || !signature.checksum) return false;

  let concat = "";
  for (const prop of signature.properties) {
    concat += getNestedValue(data, prop);
  }
  concat += String(timestamp);
  concat += eventsSecret;

  const hash = createHash("sha256").update(concat, "utf8").digest("hex");
  return hash.toLowerCase() === signature.checksum.toLowerCase();
}
