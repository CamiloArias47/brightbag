import type { Metadata } from "next";
import { CheckoutView } from "./checkout-view";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Checkout | ${SITE_NAME}`,
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
