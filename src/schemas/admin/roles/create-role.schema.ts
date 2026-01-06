import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "El nombre del rol es obligatorio."),
  permissions: z
    .array(z.number())
    .min(1, "El rol debe tener al menos un permiso asignado."),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
