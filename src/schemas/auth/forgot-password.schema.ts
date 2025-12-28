import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El campo de correo electrónico es obligatorio.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El correo electrónico no es válido."),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
