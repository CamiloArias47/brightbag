import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL, CONTACT_ADDRESS, WHATSAPP_NUMBER } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contacto | ${SITE_NAME}`,
};

export default function ContactoPage() {
  const wa = `https://wa.me/${WHATSAPP_NUMBER}`;
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Contacto</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        ¿Preguntas sobre tallas, envíos o tu pedido? Escríbenos — respondemos lo antes
        posible.
      </p>

      <ul className="mt-10 space-y-6 text-sm">
        <li>
          <p className="font-medium text-foreground">Dirección</p>
          <p className="mt-1 text-muted-foreground">{CONTACT_ADDRESS}</p>
        </li>
        <li>
          <p className="font-medium text-foreground">Correo</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-1 block text-primary hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </li>
        <li>
          <p className="font-medium text-foreground">WhatsApp</p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-primary hover:underline"
          >
            Chatear ahora
          </a>
        </li>
        <li>
          <p className="font-medium text-foreground">Consumidor</p>
          <a
            href="https://www.sic.gov.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-primary hover:underline"
          >
            Superintendencia de Industria y Comercio (SIC)
          </a>
        </li>
      </ul>

      <p className="mt-10 text-sm text-muted-foreground">
        También puedes revisar los{" "}
        <Link href="/terminos" className="text-primary hover:underline">
          términos y condiciones
        </Link>{" "}
        y la{" "}
        <Link href="/politica-privacidad" className="text-primary hover:underline">
          política de privacidad
        </Link>
        .
      </p>
    </div>
  );
}
