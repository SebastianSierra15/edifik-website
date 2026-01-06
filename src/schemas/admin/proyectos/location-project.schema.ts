import { z } from "zod";

export const locationProjectSchema = z
  .object({
    departamentId: z.number().optional(),
    cityId: z.number().optional(),
    address: z.string().optional(),
    mapAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.departamentId) {
      ctx.addIssue({
        code: "custom",
        path: ["departamentId"],
        message: "El departamento es obligatorio.",
      });
    }

    if (!data.cityId) {
      ctx.addIssue({
        code: "custom",
        path: ["cityId"],
        message: "La ciudad es obligatoria.",
      });
    }

    if (!data.address || !data.address.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["address"],
        message: "La dirección pública es obligatoria.",
      });
    }

    if (!data.mapAddress || !data.mapAddress.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["mapAddress"],
        message: "La ubicación en el mapa es obligatoria.",
      });
    }
  });
