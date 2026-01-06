import { z } from "zod";

export const processRequestSchema = z.object({
  message: z.string().trim().min(1, "El mensaje de respuesta es obligatorio."),
  actionType: z.enum(["approve", "reject", "revision"], {
    message: "Debe seleccionar un estado válido.",
  }),
});

export type ProcessRequestInput = z.infer<typeof processRequestSchema>;
