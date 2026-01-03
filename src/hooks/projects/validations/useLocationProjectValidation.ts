"use client";

import { useMemo, useState } from "react";
import type { ProjectFormData } from "@/src/interfaces";
import { locationProjectSchema as projectLocationProjectSchema } from "@/src/schemas/admin/proyectos/location-project.schema";
import { locationProjectSchema as propertyLocationProjectSchema } from "@/src/schemas/admin/inmobiliaria/location-project.schema";

const fieldSchemaMap = {
  departamentError: "departamentId",
  cityError: "cityId",
  addressError: "address",
  mapAddressError: "mapAddress",
} as const;

const issueToErrorMap = {
  departamentId: "departamentError",
  cityId: "cityError",
  address: "addressError",
  mapAddress: "mapAddressError",
} as const;

export function useLocationProjectValidation(
  formData: ProjectFormData,
  isProperty: boolean
) {
  const [errors, setErrors] = useState({
    departamentError: "",
    cityError: "",
    addressError: "",
    mapAddressError: "",
  });
  const schema = useMemo(
    () =>
      isProperty ? propertyLocationProjectSchema : projectLocationProjectSchema,
    [isProperty]
  );

  const buildSchemaData = (
    mapAddress: string,
    overrides?: Partial<object>
  ) => ({
    departamentId: formData.city?.departament?.id,
    cityId: formData.city?.id,
    address: formData.address,
    mapAddress,
    ...(overrides ?? {}),
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
    const data = buildSchemaData(
      fieldName === "mapAddressError" && typeof value === "string" ? value : "",
      {
        [schemaKey]: value,
      }
    );

    const errorMessage = getFieldError(fieldName, data);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = (mapAddress: string) => {
    const result = schema.safeParse(buildSchemaData(mapAddress));

    const newErrors: typeof errors = {
      departamentError: "",
      cityError: "",
      addressError: "",
      mapAddressError: "",
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
