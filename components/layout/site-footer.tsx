import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL, CONTACT_ADDRESS } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold tracking-tight">{SITE_NAME}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.1em] text-muted-foreground">
              Visibilidad con estilo
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Contacto</p>
            <p className="mt-2">{CONTACT_ADDRESS}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-1 block text-primary hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">Consumidor</p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>
                <a
                  href="https://www.sic.gov.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Superintendencia de Industria y Comercio (SIC)
                </a>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-foreground">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidad" className="hover:text-foreground">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-foreground">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
