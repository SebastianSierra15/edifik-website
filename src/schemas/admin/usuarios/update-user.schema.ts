import { z } from "zod";
import { createUserSchema } from "./create-user.schema";

export const updateUserSchema = createUserSchema;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
