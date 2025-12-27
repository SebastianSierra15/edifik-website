import { z } from "zod";

export const createMembershipSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  benefits: z
    .string()
    .min(1, "La descripción de los beneficios es obligatoria."),
  price: z.coerce.number(),
  projectsFeatured: z.coerce.number().nullish(),
  discountThreeMonths: z.coerce
    .number()
    .max(100, "El porcentaje de descuento debe ser menor o igual a 100.")
    .nullish(),
  discountSixMonths: z.coerce
    .number()
    .max(100, "El porcentaje de descuento debe ser menor o igual a 100.")
    .nullish(),
  discountTwelveMonths: z.coerce
    .number()
    .max(100, "El porcentaje de descuento debe ser menor o igual a 100.")
    .nullish(),
  maxProjects: z.coerce
    .number()
    .gt(0, "Debe haber al menos 1 propiedad.")
    .optional(),
});

export type CreateMembershipInput = z.infer<typeof createMembershipSchema>;
