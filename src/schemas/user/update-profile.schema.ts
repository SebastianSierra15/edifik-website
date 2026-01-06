import { z } from "zod";

const phoneRegex = /^3\d{9}$/;

export const updateProfileSchema = z.object({
  identityDocument: z.string().optional(),
  names: z.string().min(1, "Este campo es obligatorio"),
  lastnames: z.string().min(1, "Este campo es obligatorio"),
  birthdate: z.date().optional().nullable(),
  phoneNumber: z
    .string()
    .min(1, "El número de teléfono es obligatorio.")
    .refine((value) => phoneRegex.test(value.replace(/\s+/g, "")), {
      message: "Número de teléfono no válido.",
    }),
  genderId: z.number().optional().nullable(),
});
