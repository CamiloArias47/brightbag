"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  removeLine: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: (line) => {
        const qty = line.quantity ?? 1;
        set((state) => {
          const idx = state.lines.findIndex((l) => l.variantId === line.variantId);
          if (idx >= 0) {
            const next = [...state.lines];
            next[idx] = {
              ...next[idx],
              quantity: next[idx].quantity + qty,
            };
            return { lines: next };
          }
          return {
            lines: [
              ...state.lines,
              {
                variantId: line.variantId,
                productId: line.productId,
                productName: line.productName,
                variantName: line.variantName,
                sku: line.sku,
                unitPrice: line.unitPrice,
                quantity: qty,
              },
            ],
          };
        });
      },
      removeLine: (variantId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.variantId !== variantId),
        })),
      setQuantity: (variantId, quantity) => {
        if (quantity < 1) {
          get().removeLine(variantId);
          return;
        }
        set((state) => ({
          lines: state.lines.map((l) =>
            l.variantId === variantId ? { ...l, quantity } : l
          ),
        }));
      },
      clear: () => set({ lines: [] }),
    }),
    { name: "brightbag-cart" }
  )
);

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
}
