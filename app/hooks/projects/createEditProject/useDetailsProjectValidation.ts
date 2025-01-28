import { useState } from "react";
import { ProjectData } from "@/lib/definitios";

export const useDetailsProjectValidation = (formData: ProjectData) => {
  const [errors, setErrors] = useState({
    priceError: "",
    housingTypeError: "",
    availableUnitsError: "",
  });

  const validateField = (fieldName: keyof typeof errors, value: any) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: value ? "" : getErrorMessage(fieldName, value),
    }));
  };

  const getErrorMessage = (fieldName: keyof typeof errors, value: any) => {
    switch (fieldName) {
      case "priceError":
        return (formData.projectType?.id === 2 ||
          formData.projectType?.id === 3) &&
          !value
          ? "El precio es obligatorio y debe ser mayor que 0."
          : "";
      case "availableUnitsError":
        return (formData.projectType?.id === 2 ||
          formData.projectType?.id === 3) &&
          !value
          ? "La cantidad de unidades disponibles es obligatoria"
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
      availableUnitsError: getErrorMessage(
        "availableUnitsError",
        formData.availableUnits
      ),
      housingTypeError: getErrorMessage(
        "housingTypeError",
        formData.housingType
      ),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
};
