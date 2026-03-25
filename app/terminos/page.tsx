import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL, CONTACT_ADDRESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Términos y condiciones | ${SITE_NAME}`,
};

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Términos y condiciones de uso
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última actualización: marzo de 2026 · Colombia
      </p>

      <div className="mt-10 max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Identificación del comercio</h2>
          <p>
            {SITE_NAME} ofrece productos a través de este sitio web. Datos de contacto:{" "}
            {CONTACT_ADDRESS}. Correo:{" "}
            <a className="text-primary hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Objeto</h2>
          <p>
            Estos términos regulan la compra de productos disponibles en la tienda en línea,
            el uso del sitio y las obligaciones de las partes conforme a la normativa
            colombiana aplicable, incluida la Ley 1480 de 2011 (Estatuto del Consumidor) y
            la Ley 2439 de 2024 en lo pertinente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Información del producto</h2>
          <p>
            Las descripciones, fotografías y dimensiones publicadas buscan corresponder al
            producto físico. Las imágenes pueden incluir composición creativa; las medidas
            en centímetros indican el tamaño real del artículo. Si tienes dudas, contáctanos
            antes de comprar.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Precios, envío y plazos</h2>
          <p>
            Los precios se muestran en pesos colombianos (COP). El envío y tiempos estimados
            se indican antes de pagar. Si no se indica plazo de entrega, el máximo legal es
            de 30 días calendario salvo acuerdo distinto. Los costos de envío se muestran
            desglosados en el resumen del pedido antes del pago (Art. 50 Ley 1480).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Medios de pago</h2>
          <p>
            Los pagos se procesan a través de Wompi. Al pagar, aceptas también las
            condiciones del procesador de pagos. El comercio confirma el estado final del
            pago mediante los eventos (webhooks) oficiales de Wompi.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            6. Derecho de retracto y garantías
          </h2>
          <p>
            Puedes ejercer el derecho de retracto conforme a la ley aplicable. Para productos
            aptos, el plazo puede ser de hasta 5 días hábiles desde la entrega. El reembolso
            se efectuará en un plazo máximo de 15 días calendario, por el medio acordado con
            el consumidor según la normativa vigente (Ley 2439 de 2024).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Protección de datos</h2>
          <p>
            El tratamiento de datos personales se describe en la{" "}
            <Link href="/politica-privacidad" className="text-primary hover:underline">
              política de privacidad
            </Link>
            , en cumplimiento de la Ley 1581 de 2012.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Reclamaciones</h2>
          <p>
            Puedes presentar reclamaciones ante la Superintendencia de Industria y Comercio
            (SIC) en{" "}
            <a
              className="text-primary hover:underline"
              href="https://www.sic.gov.co/"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.sic.gov.co
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
