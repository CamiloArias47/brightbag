"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { prepareCheckout } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SHIPPING_COP } from "@/lib/constants";
import { formatCop } from "@/lib/format";
import { loadWompiWidgetScript, openWompiWidget } from "@/lib/wompi/script";
import {
  checkoutFormSchema,
  type CheckoutFormSchema,
} from "@/lib/validations/checkout";
import { cn } from "@/lib/utils";
import { cartSubtotal, useCartStore } from "@/stores/cart-store";

const defaults: CheckoutFormSchema = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  department: "",
  acceptPrivacy: false,
  acceptMarketing: false,
};

export function CheckoutView() {
  const lines = useCartStore((s) => s.lines);
  const [payError, setPayError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartSubtotal(lines);
  const total = subtotal + SHIPPING_COP;

  const form = useForm<CheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: defaults,
  });

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">No hay productos para pagar</h1>
        <p className="mt-2 text-muted-foreground">
          Agrega un producto al carrito antes de continuar.
        </p>
        <Link
          href="/producto"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-8 inline-flex justify-center"
          )}
        >
          Ver producto
        </Link>
      </div>
    );
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setPayError(null);
    setSubmitting(true);
    try {
      const result = await prepareCheckout({
        ...values,
        lines,
      });
      if (!result.ok) {
        setPayError(result.error);
        setSubmitting(false);
        return;
      }
      await loadWompiWidgetScript();
      openWompiWidget({
        currency: "COP",
        amountInCents: result.amountInCents,
        reference: result.reference,
        publicKey: result.publicKey,
        signature: { integrity: result.integrity },
        //redirectUrl: result.redirectUrl,
        customerData: {
          email: values.customerEmail,
          fullName: values.customerName,
          phoneNumber: values.customerPhone,
          phoneNumberPrefix: "+57",
        },
        shippingAddress: {
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          city: values.city,
          region: values.department,
          country: "CO",
          phoneNumber: values.customerPhone,
          name: values.customerName,
        },
      });
      setSubmitting(false);
    } catch (e) {
      console.error(e);
      setPayError("No se pudo iniciar el pago. Intenta de nuevo.");
      setSubmitting(false);
    }
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Resumen del pedido (Art. 50 Ley 1480): revisa productos, envío e impuestos
        antes de pagar.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <Card className="border-0 bg-surface-3/80">
          <CardHeader>
            <CardTitle>Datos de envío</CardTitle>
            <CardDescription>
              Entrega estimada: 3-5 días hábiles en Cali; 5-10 días en el resto del
              país (sujeto a transportadora).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="customerName">Nombre completo</Label>
                <Input id="customerName" {...form.register("customerName")} />
                {form.formState.errors.customerName ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.customerName.message}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customerEmail">Correo electrónico</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    {...form.register("customerEmail")}
                  />
                  {form.formState.errors.customerEmail ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.customerEmail.message}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerPhone">Teléfono</Label>
                  <Input id="customerPhone" {...form.register("customerPhone")} />
                  {form.formState.errors.customerPhone ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.customerPhone.message}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="addressLine1">Dirección línea 1</Label>
                <Input id="addressLine1" {...form.register("addressLine1")} />
                {form.formState.errors.addressLine1 ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.addressLine1.message}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="addressLine2">Apartamento / referencia (opcional)</Label>
                <Input id="addressLine2" {...form.register("addressLine2")} />
              </div>
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" {...form.register("city")} />
                  {form.formState.errors.city ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.city.message}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input id="department" {...form.register("department")} />
                  {form.formState.errors.department ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.department.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3 rounded-xl bg-surface-2/60 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Derecho de retracto (Ley 2439)</p>
                <p>
                  Puedes devolver el producto dentro de los 5 días hábiles siguientes a
                  la entrega si no ha sido usado. El reembolso se hará en un plazo máximo
                  de 15 días calendario, por el medio que elijas entre los disponibles.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Controller
                  control={form.control}
                  name="acceptPrivacy"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(v === true)}
                    />
                  )}
                />
                <Label className="text-sm font-normal leading-snug">
                  Acepto la{" "}
                  <Link href="/politica-privacidad" className="text-primary underline">
                    política de privacidad
                  </Link>{" "}
                  y el tratamiento de mis datos personales (Ley 1581).
                </Label>
              </div>
              {form.formState.errors.acceptPrivacy ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.acceptPrivacy.message}
                </p>
              ) : null}

              <div className="flex items-start gap-3">
                <Controller
                  control={form.control}
                  name="acceptMarketing"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(v) => field.onChange(v === true)}
                    />
                  )}
                />
                <Label className="text-sm font-normal leading-snug">
                  Deseo recibir novedades y promociones por correo (opcional).
                </Label>
              </div>

              {payError ? (
                <p className="text-sm text-destructive" role="alert">
                  {payError}
                </p>
              ) : null}

              <Button
                type="submit"
                className="btn-luminal-gradient w-full font-semibold"
                size="lg"
                disabled={submitting}
              >
                {submitting ? "Preparando pago…" : "Confirmar y pagar con Wompi"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 bg-surface-2/80">
            <CardHeader>
              <CardTitle>Resumen del pedido</CardTitle>
              <CardDescription>
                Desglose antes del pago: producto, cantidades, envío y total en COP.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {lines.map((line) => (
                <div
                  key={line.variantId}
                  className="flex justify-between gap-4 border-b border-border/60 py-2 last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">{line.productName}</p>
                    <p className="text-muted-foreground">
                      {line.variantName} × {line.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 font-medium">
                    {formatCop(line.unitPrice * line.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCop(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Envío estimado</span>
                <span>{formatCop(SHIPPING_COP)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold text-foreground">
                <span>Total a pagar</span>
                <span>{formatCop(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
