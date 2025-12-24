"use client";

import { useState } from "react";
import type { ProjectFormData } from "@/src/interfaces";

export function useLocationProjectValidation(formData: ProjectFormData) {
  const [errors, setErrors] = useState({
    departamentError: "",
    cityError: "",
    addressError: "",
    mapAddressError: "",
  });

  const validateField = (fieldName: keyof typeof errors, value: unknown) => {
    if (fieldName === "mapAddressError" && typeof value === "string") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mapAddressError: value.trim()
          ? ""
          : getErrorMessage("mapAddressError", value),
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: value ? "" : getErrorMessage(fieldName, value),
      }));
    }
  };

  const getErrorMessage = (fieldName: keyof typeof errors, value: unknown) => {
    switch (fieldName) {
      case "departamentError":
        return !value ? "El departamento es obligatorio." : "";
      case "cityError":
        return !value ? "La ciudad es obligatoria." : "";
      case "addressError":
        return !value || !String(value).trim()
          ? "La dirección pública es obligatoria."
          : "";
      case "mapAddressError":
        return !value || !String(value).trim()
          ? "La ubicación en el mapa es obligatoria."
          : "";
      default:
        return "";
    }
  };

  const validateFields = (mapAddress: string) => {
    const newErrors: typeof errors = {
      departamentError: getErrorMessage(
        "departamentError",
        formData.city?.departament?.id
      ),
      cityError: getErrorMessage("cityError", formData.city?.id),
      addressError: getErrorMessage("addressError", formData.address),
      mapAddressError: getErrorMessage("mapAddressError", mapAddress),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
}
