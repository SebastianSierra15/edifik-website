import { z } from "zod";

export const createUserSchema = z.object({
  names: z.string().min(1, "El nombre es obligatorio."),
  lastnames: z.string().min(1, "El apellido es obligatorio."),
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El correo electrónico no es válido."),
  phoneNumber: z
    .string()
    .min(1, "El número de teléfono es obligatorio.")
    .regex(/^\d{10}$/, "El número de teléfono debe tener 10 dígitos."),
  genderId: z.coerce.number().gt(0, "El género es obligatorio."),
  roleId: z.coerce.number().gt(0, "El rol es obligatorio."),
  membershipId: z.coerce.number().gt(0, "La membresía es obligatoria."),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
