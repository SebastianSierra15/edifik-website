import { z } from "zod";

export const registerUserSchema = z.object({
  names: z.string().min(1, "El nombre es obligatorio."),
  lastnames: z.string().min(1, "El apellido es obligatorio."),
  birthdate: z.string().min(1, "La fecha de nacimiento es obligatoria."),
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El correo electrónico no es válido."),
  phoneNumber: z
    .string()
    .transform((value) => value.replace(/\s+/g, ""))
    .refine(
      (value) => value.length > 0,
      "El número de teléfono es obligatorio."
    )
    .refine(
      (value) => /^3\d{9}$/.test(value),
      "Núamero de teléfono no válido."
    ),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
