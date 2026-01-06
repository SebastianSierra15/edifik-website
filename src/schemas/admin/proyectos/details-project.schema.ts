import { z } from "zod";

const parsePrice = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9]/g, "");
    return normalized ? Number(normalized) : 0;
  }
  return 0;
};

export const detailsProjectSchema = z
  .object({
    price: z.any().optional(),
    propertyTypeId: z.number().optional(),
    housingTypeId: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    const numericPrice = parsePrice(data.price);

    if (!numericPrice || numericPrice <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "El precio es obligatorio y debe ser mayor que 0.",
      });
    }

    if (
      (data.propertyTypeId === 1001 || data.propertyTypeId === 1002) &&
      !data.housingTypeId
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["housingTypeId"],
        message: "Seleccione un tipo de vivienda.",
      });
    }
  });
