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
      [fieldName]: getErrorMessage(fieldName, value),
    }));
  };

  const parsePrice = (value: unknown) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const normalized = value.replace(/[^0-9]/g, "");
      return normalized ? Number(normalized) : 0;
    }
    return 0;
  };

  const getErrorMessage = (fieldName: keyof typeof errors, value: unknown) => {
    switch (fieldName) {
      case "priceError":
        const numericPrice = parsePrice(value);
        if (!numericPrice || numericPrice <= 0) {
          return "El precio es obligatorio y debe ser mayor que 0.";
        }
        return "";
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
