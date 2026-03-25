"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { SITE_NAME } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const count = useCartStore((s) =>
    s.lines.reduce((n, l) => n + l.quantity, 0)
  );

  return (
    <header
      className={cn(
        "glass-nav sticky top-0 z-50 border-b border-transparent",
        "bg-[color-mix(in_srgb,var(--surface-2)_82%,transparent)]"
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Inicio
          </Link>
          <Link href="/producto" className="hover:text-foreground transition-colors">
            Producto
          </Link>
          <Link
            href="/carrito"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "inline-flex gap-1.5"
            )}
          >
            <ShoppingBag className="size-4" aria-hidden />
            Carrito
            {count > 0 ? (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                {count}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
