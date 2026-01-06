import { z } from "zod";

const shouldShowField = (field: string, propertyTypeId?: number) => {
  const fieldsFor1001And1002 = [
    "socioeconomicLevel",
    "yearBuilt",
    "bedrooms",
    "storageUnits",
    "balcony",
    "laundryArea",
    "customizationOptions",
  ];

  const fieldsFor1001 = ["terrace", "garden"];
  const fieldsFor1001_1002_1004 = ["bathrooms", "lobbies"];
  const fieldsFor1002_1003_1004 = ["elevator"];
  const fieldsFor1002 = ["towers", "floorNumber"];
  const fieldsFor1004_1003_1005 = ["freeHeight"];
  const fieldsFor1005_1006_1007 = ["width", "length"];
  const fieldsFor1005 = ["heavyParking"];

  if (fieldsFor1001And1002.includes(field)) {
    return propertyTypeId === 1001 || propertyTypeId === 1002;
  }
  if (fieldsFor1001.includes(field)) {
    return propertyTypeId === 1001;
  }
  if (fieldsFor1001_1002_1004.includes(field)) {
    return (
      propertyTypeId === 1001 ||
      propertyTypeId === 1002 ||
      propertyTypeId === 1004
    );
  }
  if (fieldsFor1002_1003_1004.includes(field)) {
    return (
      propertyTypeId === 1002 ||
      propertyTypeId === 1003 ||
      propertyTypeId === 1004
    );
  }
  if (fieldsFor1002.includes(field)) {
    return propertyTypeId === 1002;
  }
  if (fieldsFor1004_1003_1005.includes(field)) {
    return (
      propertyTypeId === 1004 ||
      propertyTypeId === 1003 ||
      propertyTypeId === 1005
    );
  }
  if (fieldsFor1005_1006_1007.includes(field)) {
    return (
      propertyTypeId === 1005 ||
      propertyTypeId === 1006 ||
      propertyTypeId === 1007
    );
  }
  if (fieldsFor1005.includes(field)) {
    return propertyTypeId === 1005;
  }

  return true;
};

export const featuresProjectSchema = z
  .object({
    builtArea: z.any().optional(),
    totalArea: z.any().optional(),
    bathrooms: z.any().optional(),
    bedrooms: z.any().optional(),
    lobbies: z.any().optional(),
    freeHeight: z.any().optional(),
    width: z.any().optional(),
    length: z.any().optional(),
    towers: z.any().optional(),
    socioeconomicLevel: z.any().optional(),
    yearBuilt: z.any().optional(),
    propertyTypeId: z.number().optional(),
    projectTypeId: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    const propertyTypeId = data.propertyTypeId;
    const projectTypeId = data.projectTypeId;

    const baseRequiredFields: Record<string, string> = {
      builtArea: "El área construida es obligatoria.",
      totalArea: "El área total es obligatoria.",
      bathrooms: "El número de baños es obligatorio.",
      bedrooms: "El número de habitaciones es obligatorio.",
      lobbies: "El número de salas de estar es obligatorio.",
      freeHeight: "La altura libre es obligatoria.",
      width: "El ancho es obligatorio.",
      length: "El largo es obligatorio.",
    };

    const baseRequiredEntries = Object.entries(baseRequiredFields) as Array<
      [keyof typeof baseRequiredFields, string]
    >;

    baseRequiredEntries.forEach(([field, message]) => {
      const dataField = field as keyof typeof data;

      if (shouldShowField(field, propertyTypeId) && !data[dataField]) {
        ctx.addIssue({
          code: "custom",
          path: [field],
          message,
        });
      }
    });

    if (
      shouldShowField("towers", propertyTypeId) &&
      projectTypeId === 1 &&
      !data.towers
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["towers"],
        message: "El número de torres es obligatorio.",
      });
    }

    if (
      shouldShowField("socioeconomicLevel", propertyTypeId) &&
      (projectTypeId === 2 || projectTypeId === 3) &&
      !data.socioeconomicLevel
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["socioeconomicLevel"],
        message: "El estrato es obligatorio.",
      });
    }

    if (
      shouldShowField("yearBuilt", propertyTypeId) &&
      (projectTypeId === 2 || projectTypeId === 3) &&
      !data.yearBuilt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["yearBuilt"],
        message: "El año de construcción es obligatorio.",
      });
    }
  });
