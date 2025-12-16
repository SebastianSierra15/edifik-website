import { useState } from "react";
import type { ProjectDetails } from "@/src/interfaces";

interface LocationErrors {
  departamentError: string;
  cityError: string;
  addressError: string;
  mapAddressError: string;
}

export function useLocationProjectValidation(formData: ProjectDetails) {
  const [errors, setErrors] = useState<LocationErrors>({
    departamentError: "",
    cityError: "",
    addressError: "",
    mapAddressError: "",
  });

  const getErrorMessage = (
    field: keyof LocationErrors,
    value: unknown
  ): string => {
    switch (field) {
      case "departamentError":
        return !value ? "El departamento es obligatorio." : "";
      case "cityError":
        return !value ? "La ciudad es obligatoria." : "";
      case "addressError":
        return !value ? "La dirección pública es obligatoria." : "";
      case "mapAddressError":
        return !value ? "La ubicación en el mapa es obligatoria." : "";
      default:
        return "";
    }
  };

  const validateField = (field: keyof LocationErrors, value: unknown) => {
    setErrors((prev) => ({
      ...prev,
      [field]: getErrorMessage(field, value),
    }));
  };

  const validateFields = (mapAddress: string): boolean => {
    const newErrors: LocationErrors = {
      departamentError: getErrorMessage(
        "departamentError",
        formData.city?.departament?.id
      ),
      cityError: getErrorMessage("cityError", formData.city?.id),
      addressError: getErrorMessage("addressError", formData.address),
      mapAddressError: getErrorMessage("mapAddressError", mapAddress),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  return { errors, validateField, validateFields };
}
