"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";

export function ClearCartOnApproved({ status }: { status: string | null }) {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    if (status === "APPROVED") {
      clear();
    }
  }, [status, clear]);

  return null;
}
