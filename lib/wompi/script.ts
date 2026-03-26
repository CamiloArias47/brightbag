const WOMPI_WIDGET_SRC = "https://checkout.wompi.co/widget.js";

export function loadWompiWidgetScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (document.querySelector(`script[src="${WOMPI_WIDGET_SRC}"]`)) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = WOMPI_WIDGET_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("No se pudo cargar Wompi"));
    document.body.appendChild(s);
  });
}

export type WompiWidgetConfig = {
  currency: "COP";
  amountInCents: number;
  reference: string;
  publicKey: string;
  signature: { integrity: string };
  redirectUrl?: string;
  customerData?: {
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    phoneNumberPrefix?: string;
  };
  shippingAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    region?: string;
    country?: string;
    phoneNumber?: string;
    name?: string;
  };
};

declare global {
  interface Window {
    WidgetCheckout: new (config: WompiWidgetConfig) => {
      open: (
        callback: (result: {
          transaction: { id: string; status: string; reference?: string };
        }) => void
      ) => void;
    };
  }
}

export function openWompiWidget(config: WompiWidgetConfig): void {
  console.log("openWompiWidget config:", config);
  if (!window.WidgetCheckout) {
    throw new Error("WidgetCheckout no disponible");
  }
  console.log("openWompiWidget config2:");
  const checkout = new window.WidgetCheckout(config);
  checkout.open(() => {
    /* redirectUrl maneja la vuelta del usuario; el webhook confirma el pago */
  });
}
