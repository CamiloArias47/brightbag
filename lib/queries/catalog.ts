import { createClient } from "@/lib/supabase/server";
import type { ProductRow, VariantRow } from "@/lib/types/database";

export { variantPriceCOP } from "@/lib/pricing";

export async function getPrimaryProductWithVariants(): Promise<{
  product: ProductRow;
  variants: VariantRow[];
} | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return null;
  }

  const { data: products, error: pErr } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1);

  if (pErr || !products?.length) {
    console.error("getPrimaryProductWithVariants products:", pErr);
    return null;
  }

  const product = products[0] as ProductRow;

  const { data: variants, error: vErr } = await supabase
    .from("variants")
    .select("*")
    .eq("product_id", product.id)
    .order("name", { ascending: true });

  if (vErr) {
    console.error("getPrimaryProductWithVariants variants:", vErr);
    return null;
  }

  return {
    product,
    variants: (variants ?? []) as VariantRow[],
  };
}
