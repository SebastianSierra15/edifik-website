import { z } from "zod";
import { createMembershipSchema } from "./create-membership.schema";

export const updateMembershipSchema = createMembershipSchema;

export type UpdateMembershipInput = z.infer<typeof updateMembershipSchema>;
