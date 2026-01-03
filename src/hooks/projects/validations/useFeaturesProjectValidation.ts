"use client";

import { useMemo, useState } from "react";
import type { ProjectFormData } from "@/src/interfaces";
import { featuresProjectSchema as projectFeaturesProjectSchema } from "@/src/schemas/admin/proyectos/features-project.schema";
import { featuresProjectSchema as propertyFeaturesProjectSchema } from "@/src/schemas/admin/inmobiliaria/features-project.schema";

const fieldSchemaMap = {
  builtAreaError: "builtArea",
  totalAreaError: "totalArea",
  bathroomsError: "bathrooms",
  bedroomsError: "bedrooms",
  lobbiesError: "lobbies",
  freeHeightError: "freeHeight",
  widthError: "width",
  lengthError: "length",
  towersError: "towers",
  socioeconomicLevelError: "socioeconomicLevel",
  yearBuiltError: "yearBuilt",
} as const;

const issueToErrorMap = {
  builtArea: "builtAreaError",
  totalArea: "totalAreaError",
  bathrooms: "bathroomsError",
  bedrooms: "bedroomsError",
  lobbies: "lobbiesError",
  freeHeight: "freeHeightError",
  width: "widthError",
  length: "lengthError",
  towers: "towersError",
  socioeconomicLevel: "socioeconomicLevelError",
  yearBuilt: "yearBuiltError",
} as const;

export function useFeaturesProjectValidation(
  formData: ProjectFormData,
  isProperty: boolean
) {
  const [errors, setErrors] = useState({
    builtAreaError: "",
    totalAreaError: "",
    bathroomsError: "",
    bedroomsError: "",
    lobbiesError: "",
    freeHeightError: "",
    widthError: "",
    lengthError: "",
    towersError: "",
    socioeconomicLevelError: "",
    yearBuiltError: "",
  });
  const schema = useMemo(
    () =>
      isProperty ? propertyFeaturesProjectSchema : projectFeaturesProjectSchema,
    [isProperty]
  );

  const buildSchemaData = (overrides?: Partial<Record<string, unknown>>) => ({
    builtArea: overrides?.builtArea ?? formData.builtArea,
    totalArea: overrides?.totalArea ?? formData.totalArea,
    bathrooms: overrides?.bathrooms ?? formData.bathrooms,
    bedrooms: overrides?.bedrooms ?? formData.bedrooms,
    lobbies: overrides?.lobbies ?? formData.lobbies,
    freeHeight: overrides?.freeHeight ?? formData.freeHeight,
    width: overrides?.width ?? formData.width,
    length: overrides?.length ?? formData.length,
    towers: overrides?.towers ?? formData.towers,
    socioeconomicLevel:
      overrides?.socioeconomicLevel ?? formData.socioeconomicLevel,
    yearBuilt: overrides?.yearBuilt ?? formData.yearBuilt,
    propertyTypeId: formData.propertyType?.id,
    projectTypeId: formData.projectType?.id,
  });

  const getFieldError = (fieldName: keyof typeof errors, data: object) => {
    const result = schema.safeParse(data);

    if (result.success) {
      return "";
    }

    const issue = result.error.issues.find(
      (item) => item.path[0] === fieldSchemaMap[fieldName]
    );

    return issue?.message ?? "";
  };

  const validateField = (fieldName: keyof typeof errors, value: unknown) => {
    const schemaKey = fieldSchemaMap[fieldName];
    if (!schemaKey) {
      return;
    }
    const errorMessage = getFieldError(fieldName, {
      ...buildSchemaData(),
      [schemaKey]: value,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = () => {
    const result = schema.safeParse(buildSchemaData());

    const newErrors: Partial<typeof errors> = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field !== "string") {
          continue;
        }

        const errorKey =
          issueToErrorMap[field as keyof typeof issueToErrorMap];

        if (errorKey && !newErrors[errorKey]) {
          newErrors[errorKey] = issue.message;
        }
      }
    }

    Object.keys(errors).forEach((key) => {
      if (!newErrors[key as keyof typeof errors]) {
        newErrors[key as keyof typeof errors] = "";
      }
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));

    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
}
