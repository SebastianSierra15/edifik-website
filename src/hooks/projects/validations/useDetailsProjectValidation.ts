import { useState } from "react";
import type { ProjectDetails } from "@/src/interfaces";

interface DetailsErrors {
  priceError: string;
  housingTypeError: string;
}

export function useDetailsProjectValidation(formData: ProjectDetails) {
  const [errors, setErrors] = useState<DetailsErrors>({
    priceError: "",
    housingTypeError: "",
  });

  const getErrorMessage = (
    field: keyof DetailsErrors,
    value: unknown
  ): string => {
    switch (field) {
      case "priceError":
        return !value ? "El precio es obligatorio." : "";
      case "housingTypeError":
        return !value ? "Seleccione un tipo de vivienda." : "";
      default:
        return "";
    }
  };

  const validateField = (field: keyof DetailsErrors, value: unknown) => {
    setErrors((prev) => ({
      ...prev,
      [field]: getErrorMessage(field, value),
    }));
  };

  const validateFields = (): boolean => {
    const newErrors: DetailsErrors = {
      priceError: getErrorMessage("priceError", formData.price),
      housingTypeError: getErrorMessage(
        "housingTypeError",
        formData.housingType
      ),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  return { errors, validateField, validateFields };
}
