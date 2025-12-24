"use client";

import { useState } from "react";
import type { ProjectFormData } from "@/src/interfaces";

export function useDetailsProjectValidation(formData: ProjectFormData) {
  const [errors, setErrors] = useState({
    priceError: "",
    housingTypeError: "",
  });

  const validateField = (fieldName: keyof typeof errors, value: unknown) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: value ? "" : getErrorMessage(fieldName, value),
    }));
  };

  const getErrorMessage = (fieldName: keyof typeof errors, value: unknown) => {
    switch (fieldName) {
      case "priceError":
        return (formData.projectType?.id === 2 ||
          formData.projectType?.id === 3) &&
          !value
          ? "El precio es obligatorio y debe ser mayor que 0."
          : "";
      case "housingTypeError":
        return (formData.propertyType?.id === 1001 ||
          formData.propertyType?.id === 1002) &&
          !value
          ? "Seleccione un tipo de vivienda."
          : "";
      default:
        return "";
    }
  };

  const validateFields = () => {
    const newErrors: typeof errors = {
      priceError: getErrorMessage("priceError", formData.price),
      housingTypeError: getErrorMessage(
        "housingTypeError",
        formData.housingType
      ),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
}
