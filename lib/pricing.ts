import type { ProductRow, VariantRow } from "@/lib/types/database";

export function variantPriceCOP(
  variant: VariantRow,
  product: ProductRow
): number {
  if (variant.price_override != null) {
    return Number(variant.price_override);
  }
  return Number(product.base_price);
}
