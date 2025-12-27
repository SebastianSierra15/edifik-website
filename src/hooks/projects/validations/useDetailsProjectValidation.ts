"use client";

import { useMemo, useState } from "react";
import type { ProjectFormData } from "@/src/interfaces";
import { detailsProjectSchema as projectDetailsProjectSchema } from "@/src/schemas/admin/proyectos/details-project.schema";
import { detailsProjectSchema as propertyDetailsProjectSchema } from "@/src/schemas/admin/propiedades/details-project.schema";

const fieldSchemaMap = {
  priceError: "price",
  housingTypeError: "housingTypeId",
} as const;

const issueToErrorMap = {
  price: "priceError",
  housingTypeId: "housingTypeError",
} as const;

export function useDetailsProjectValidation(
  formData: ProjectFormData,
  isProperty: boolean
) {
  const [errors, setErrors] = useState({
    priceError: "",
    housingTypeError: "",
  });
  const schema = useMemo(
    () =>
      isProperty ? propertyDetailsProjectSchema : projectDetailsProjectSchema,
    [isProperty]
  );

  const buildSchemaData = (overrides?: Partial<Record<string, unknown>>) => ({
    price: overrides?.price ?? formData.price,
    propertyTypeId: formData.propertyType?.id,
    housingTypeId: overrides?.housingTypeId ?? formData.housingType?.id,
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

    const newErrors: typeof errors = {
      priceError: "",
      housingTypeError: "",
    };

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

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
}
