"use client";

import { useMemo, useState } from "react";
import type { ProjectFormData } from "@/src/interfaces";
import { getBasicProjectSchema as getProjectBasicProjectSchema } from "@/src/schemas/admin/proyectos/basic-project.schema";
import { getBasicProjectSchema as getPropertyBasicProjectSchema } from "@/src/schemas/admin/propiedades/basic-project.schema";
import { useCheckName } from "../../checkName";

interface BasicProjectErrors {
  nameError: string;
  emailError: string;
  shortDescriptionError: string;
  detailedDescriptionError: string;
  propertyTypeError: string;
  projectTypeError: string;
}

const fieldSchemaMap: Record<keyof BasicProjectErrors, string> = {
  nameError: "name",
  emailError: "email",
  shortDescriptionError: "shortDescription",
  detailedDescriptionError: "detailedDescription",
  propertyTypeError: "propertyTypeId",
  projectTypeError: "projectTypeId",
};

const issueToErrorMap: Record<string, keyof BasicProjectErrors> = {
  name: "nameError",
  email: "emailError",
  shortDescription: "shortDescriptionError",
  detailedDescription: "detailedDescriptionError",
  propertyTypeId: "propertyTypeError",
  projectTypeId: "projectTypeError",
};

const resolveIdValue = (value: unknown) => {
  if (value && typeof value === "object" && "id" in value) {
    return (value as { id?: number }).id;
  }
  return value;
};

export function useBasicProjectValidation(
  formData: ProjectFormData,
  isProperty: boolean,
  isEdit: boolean
) {
  const [errors, setErrors] = useState<BasicProjectErrors>({
    nameError: "",
    emailError: "",
    shortDescriptionError: "",
    detailedDescriptionError: "",
    propertyTypeError: "",
    projectTypeError: "",
  });

  const { checkName } = useCheckName();
  const schema = useMemo(() => {
    const getSchema = isProperty
      ? getPropertyBasicProjectSchema
      : getProjectBasicProjectSchema;
    return getSchema({ isProperty });
  }, [isProperty]);

  const buildSchemaData = (overrides?: Partial<Record<string, unknown>>) => ({
    name: overrides?.name ?? formData.name,
    email: overrides?.email ?? formData.email,
    shortDescription:
      overrides?.shortDescription ?? formData.shortDescription ?? "",
    detailedDescription:
      overrides?.detailedDescription ?? formData.detailedDescription ?? "",
    propertyTypeId: overrides?.propertyTypeId ?? formData.propertyType?.id,
    projectTypeId: overrides?.projectTypeId ?? formData.projectType?.id,
  });

  const getFieldError = (fieldName: keyof BasicProjectErrors, data: object) => {
    const result = schema.safeParse(data);

    if (result.success) {
      return "";
    }

    const issue = result.error.issues.find(
      (item) => item.path[0] === fieldSchemaMap[fieldName]
    );

    return issue?.message ?? "";
  };

  const validateField = async (
    fieldName: keyof BasicProjectErrors,
    value: unknown
  ) => {
    const schemaKey = fieldSchemaMap[fieldName];
    const normalizedValue = ["propertyTypeId", "projectTypeId"].includes(
      schemaKey
    )
      ? resolveIdValue(value)
      : value;

    let errorMessage = getFieldError(
      fieldName,
      buildSchemaData({ [schemaKey]: normalizedValue })
    );

    if (!isProperty && fieldName === "nameError" && value) {
      const total = await checkName(
        "project",
        String(value),
        isEdit ? formData.id : undefined
      );

      if (total) {
        errorMessage = "El nombre del proyecto ya está en uso, elige otro.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = async () => {
    const result = schema.safeParse(buildSchemaData());

    const newErrors: BasicProjectErrors = {
      nameError: "",
      emailError: "",
      shortDescriptionError: "",
      detailedDescriptionError: "",
      propertyTypeError: "",
      projectTypeError: "",
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

    if (formData.email && !formData.ownerId) {
      const foundUser = await checkName("user", formData.email);
      if (!foundUser) {
        newErrors.emailError =
          "El correo ingresado no pertenece a un usuario registrado.";
      }
    }

    if (!isProperty && formData.name) {
      const total = await checkName(
        "project",
        formData.name,
        isEdit ? formData.id : undefined
      );

      if (total) {
        newErrors.nameError =
          "El nombre del proyecto ya está en uso, elige otro.";
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
}
