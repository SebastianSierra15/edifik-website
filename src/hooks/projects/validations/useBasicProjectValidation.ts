import { useState } from "react";
import type { ProjectDetails } from "@/src/interfaces";
import { useCheckName } from "../../checkName";

interface BasicProjectErrors {
  nameError: string;
  emailError: string;
  shortDescriptionError: string;
  detailedDescriptionError: string;
  propertyTypeError: string;
  projectTypeError: string;
}

export function useBasicProjectValidation(
  formData: ProjectDetails,
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

  const getErrorMessage = (
    field: keyof BasicProjectErrors,
    value: unknown
  ): string => {
    switch (field) {
      case "emailError":
        if (
          isProperty &&
          typeof value === "string" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          return "Ingrese un correo electrónico válido.";
        }
        return "";

      case "shortDescriptionError":
        return !value ? "El resumen breve es obligatorio." : "";

      case "detailedDescriptionError":
        return !value ? "La descripción completa es obligatoria." : "";

      case "propertyTypeError":
        return !value ? "Seleccione el tipo de propiedad." : "";

      case "projectTypeError":
        return isProperty && !value
          ? "Seleccione la finalidad de la propiedad."
          : "";

      default:
        return "";
    }
  };

  const validateField = async (
    field: keyof BasicProjectErrors,
    value: unknown
  ) => {
    let errorMessage = getErrorMessage(field, value);

    if (!isProperty && field === "nameError" && typeof value === "string") {
      const total = await checkName(
        "project",
        value,
        isEdit ? formData.id : undefined
      );
      if (total) {
        errorMessage = "El nombre del proyecto ya está en uso.";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

  const validateFields = async (): Promise<boolean> => {
    const newErrors: BasicProjectErrors = {
      nameError: "",
      emailError: getErrorMessage("emailError", formData.email),
      shortDescriptionError: getErrorMessage(
        "shortDescriptionError",
        formData.shortDescription
      ),
      detailedDescriptionError: getErrorMessage(
        "detailedDescriptionError",
        formData.detailedDescription
      ),
      propertyTypeError: getErrorMessage(
        "propertyTypeError",
        formData.propertyType
      ),
      projectTypeError: getErrorMessage(
        "projectTypeError",
        formData.projectType
      ),
    };

    if (!isProperty && formData.name) {
      const total = await checkName(
        "project",
        formData.name,
        isEdit ? formData.id : undefined
      );
      if (total) newErrors.nameError = "El nombre del proyecto ya está en uso.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  return { errors, validateField, validateFields };
}
