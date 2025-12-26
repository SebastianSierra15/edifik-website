"use client";

import { useState } from "react";
import type { ProjectFormData } from "@/src/interfaces";
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

  const getErrorMessage = (
    fieldName: keyof BasicProjectErrors,
    value: unknown
  ) => {
    switch (fieldName) {
      case "nameError":
        if (isProperty) return "";
        if (!value) return "El nombre es obligatorio.";
        if (typeof value === "string") {
          if (value.length < 5) {
            return "El nombre debe tener al menos 5 caracteres.";
          }
          if (value.length > 100) {
            return "El nombre no puede superar 100 caracteres.";
          }
        }
        return "";
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
        if (!value) return "El resumen breve es obligatorio.";
        if (typeof value === "string") {
          if (value.length < 50) {
            return "El resumen breve debe tener al menos 50 caracteres.";
          }
          if (value.length > 150) {
            return "El resumen breve no puede superar 150 caracteres.";
          }
        }
        return "";
      case "detailedDescriptionError":
        if (!value) return "La descripcion completa es obligatoria.";
        if (typeof value === "string") {
          if (value.length < 100) {
            return "La descripcion completa debe tener al menos 100 caracteres.";
          }
          if (value.length > 1500) {
            return "La descripcion completa no puede superar 1500 caracteres.";
          }
        }
        return "";
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
    fieldName: keyof BasicProjectErrors,
    value: unknown
  ) => {
    let errorMessage = getErrorMessage(fieldName, value);

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
    const newErrors: BasicProjectErrors = {
      nameError: isProperty ? "" : getErrorMessage("nameError", formData.name),
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
