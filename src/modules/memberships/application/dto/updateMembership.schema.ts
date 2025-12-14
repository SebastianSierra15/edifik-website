import { z } from "zod";
import { UpdateMembershipDTO } from "./UpdateMembershipDTO";

export const updateMembershipSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(3).max(100),
  price: z.number().positive(),
  durationMonths: z.number().int().positive(),
  isActive: z.boolean(),
}) satisfies z.ZodType<UpdateMembershipDTO>;
