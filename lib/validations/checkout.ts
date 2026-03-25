import { z } from "zod";

export const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Ingresa tu nombre"),
  customerEmail: z.string().email("Correo inválido"),
  customerPhone: z.string().min(7, "Teléfono inválido"),
  addressLine1: z.string().min(4, "Dirección requerida"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "Ciudad requerida"),
  department: z.string().min(2, "Departamento requerido"),
  acceptPrivacy: z
    .boolean()
    .refine((v) => v === true, "Debes aceptar la política de privacidad"),
  acceptMarketing: z.boolean().optional(),
});

export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>;
