import { useState } from "react";
import { ProjectData } from "@/lib/definitios";

export const useLocationProjectValidation = (formData: ProjectData) => {
  const [errors, setErrors] = useState({
    departamentError: "",
    cityError: "",
    addressError: "",
  });

  const validateField = (fieldName: keyof typeof errors, value: any) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: value ? "" : getErrorMessage(fieldName, value),
    }));
  };

  const getErrorMessage = (fieldName: keyof typeof errors, value: any) => {
    switch (fieldName) {
      case "departamentError":
        return !value ? "El departamento es obligatorio." : "";
      case "cityError":
        return !value ? "La ciudad es obligatoria." : "";
      case "addressError":
        return !value?.trim() ? "La dirección es obligatoria." : "";
      default:
        return "";
    }
  };

  const validateFields = () => {
    const newErrors: typeof errors = {
      departamentError: getErrorMessage(
        "departamentError",
        formData.city?.departament?.id
      ),
      cityError: getErrorMessage("cityError", formData.city?.id),
      addressError: getErrorMessage("addressError", formData.address),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
};
