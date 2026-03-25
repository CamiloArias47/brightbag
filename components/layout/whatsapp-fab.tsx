import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const message = encodeURIComponent(
  "Hola, quiero información sobre BrightBag."
);

export function WhatsAppFab() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      aria-label="Escríbenos por WhatsApp"
    >
      <MessageCircle className="size-7" />
    </Link>
  );
}
