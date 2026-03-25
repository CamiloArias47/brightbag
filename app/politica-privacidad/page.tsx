import type { Metadata } from "next";
import { SITE_NAME, CONTACT_EMAIL, CONTACT_ADDRESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Política de privacidad | ${SITE_NAME}`,
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Política de tratamiento de datos personales
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Responsable: {SITE_NAME} · {CONTACT_ADDRESS} · {CONTACT_EMAIL}
      </p>

      <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Finalidad</h2>
          <p>
            Tratamos datos personales para gestionar pedidos, envíos, soporte, cumplimiento
            de obligaciones legales y, si nos das tu consentimiento aparte, envío de
            novedades o promociones.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Base legal</h2>
          <p>
            Ejecución de contrato, cumplimiento legal, interés legítimo y, cuando aplique,
            consentimiento expreso (p. ej. marketing opcional).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Datos tratados</h2>
          <p>
            Identificación y contacto (nombre, correo, teléfono), dirección de envío, datos
            de transacción necesarios para el cobro (gestionados por Wompi según su
            política), y registros de comunicación.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Derechos ARCO</h2>
          <p>
            Puedes solicitar acceso, rectificación, actualización, supresión y oposición
            escribiendo a {CONTACT_EMAIL}. También puedes consultar al proveedor de hosting
            o base de datos cuando aplique.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Conservación</h2>
          <p>
            Conservamos la información el tiempo necesario para la finalidad descrita y los
            plazos legales (facturación, garantías, defensa de reclamaciones).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Transferencias</h2>
          <p>
            Proveedores de pago (Wompi), transporte y alojamiento (p. ej. Vercel / Supabase)
            pueden tratar datos en calidad de encargados, conforme a sus políticas y
            contratos estándar.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Registro RNBD</h2>
          <p>
            Si aplica según volumen y tipo de datos, el responsable debe registrar las bases
            de datos ante el RNBD de la SIC, conforme a la normativa vigente.
          </p>
        </section>
      </div>
    </div>
  );
}
