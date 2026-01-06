import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .refine((value) => value.trim().length > 0, "El nombre es obligatorio."),
  phone: z
    .string()
    .refine(
      (value) => value.replace(/\s+/g, "").length > 0,
      "El teléfono es obligatorio."
    )
    .refine(
      (value) => /^3\d{9}$/.test(value.replace(/\s+/g, "")),
      "Número de teléfono no válido."
    ),
  email: z
    .string()
    .refine((value) => value.trim().length > 0, "El correo es obligatorio.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El correo no es válido."),
  message: z
    .string()
    .refine((value) => value.trim().length > 0, "El mensaje es obligatorio."),
});

export type ContactFormSchemaInput = z.infer<typeof contactFormSchema>;
