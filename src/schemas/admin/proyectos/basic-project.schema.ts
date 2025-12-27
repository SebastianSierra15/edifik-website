import { z } from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface BasicProjectSchemaOptions {
  isProperty: boolean;
}

export const getBasicProjectSchema = ({
  isProperty,
}: BasicProjectSchemaOptions) =>
  z
    .object({
      name: z.string().optional(),
      email: z.string().optional(),
      shortDescription: z.string().optional(),
      detailedDescription: z.string().optional(),
      propertyTypeId: z.number().optional(),
      projectTypeId: z.number().optional(),
    })
    .superRefine((data, ctx) => {
      const name = data.name ?? "";
      const shortDescription = data.shortDescription ?? "";
      const detailedDescription = data.detailedDescription ?? "";

      if (!isProperty) {
        if (!name) {
          ctx.addIssue({
            code: "custom",
            path: ["name"],
            message: "El nombre es obligatorio.",
          });
        } else if (name.length < 5) {
          ctx.addIssue({
            code: "custom",
            path: ["name"],
            message: "El nombre debe tener al menos 5 caracteres.",
          });
        } else if (name.length > 100) {
          ctx.addIssue({
            code: "custom",
            path: ["name"],
            message: "El nombre no puede superar 100 caracteres.",
          });
        }
      }

      if (
        isProperty &&
        typeof data.email === "string" &&
        !EMAIL_REGEX.test(data.email)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Ingrese un correo electrónico válido.",
        });
      }

      if (!shortDescription) {
        ctx.addIssue({
          code: "custom",
          path: ["shortDescription"],
          message: "El resumen breve es obligatorio.",
        });
      } else if (shortDescription.length < 50) {
        ctx.addIssue({
          code: "custom",
          path: ["shortDescription"],
          message: "El resumen breve debe tener al menos 50 caracteres.",
        });
      } else if (shortDescription.length > 150) {
        ctx.addIssue({
          code: "custom",
          path: ["shortDescription"],
          message: "El resumen breve no puede superar 150 caracteres.",
        });
      }

      if (!detailedDescription) {
        ctx.addIssue({
          code: "custom",
          path: ["detailedDescription"],
          message: "La descripcion completa es obligatoria.",
        });
      } else if (detailedDescription.length < 100) {
        ctx.addIssue({
          code: "custom",
          path: ["detailedDescription"],
          message:
            "La descripcion completa debe tener al menos 100 caracteres.",
        });
      } else if (detailedDescription.length > 1500) {
        ctx.addIssue({
          code: "custom",
          path: ["detailedDescription"],
          message: "La descripcion completa no puede superar 1500 caracteres.",
        });
      }

      if (!data.propertyTypeId) {
        ctx.addIssue({
          code: "custom",
          path: ["propertyTypeId"],
          message: "Seleccione el tipo de propiedad.",
        });
      }

      if (isProperty && !data.projectTypeId) {
        ctx.addIssue({
          code: "custom",
          path: ["projectTypeId"],
          message: "Seleccione la finalidad de la propiedad.",
        });
      }
    });
