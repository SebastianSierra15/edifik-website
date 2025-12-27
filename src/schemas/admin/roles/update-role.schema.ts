import { z } from "zod";
import { createRoleSchema } from "./create-role.schema";

export const updateRoleSchema = createRoleSchema;

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
