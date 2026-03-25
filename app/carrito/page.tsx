import type { Metadata } from "next";
import { CartView } from "./cart-view";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Carrito | ${SITE_NAME}`,
};

export default function CarritoPage() {
  return <CartView />;
}
