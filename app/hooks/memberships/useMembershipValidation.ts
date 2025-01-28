import { useState } from "react";
import { useCheckName } from "../checkName/useCheckName";

export const useMembershipValidation = (membership: any, isEdit: boolean) => {
  const [errors, setErrors] = useState({
    nameError: "",
    benefitsError: "",
    discountThreeMonthsError: "",
    discountSixMonthsError: "",
    discountTwelveMonthsError: "",
    maxProjectsError: "",
  });

  const { checkName } = useCheckName();

  const getErrorMessage = (fieldName: keyof typeof errors, value: any) => {
    switch (fieldName) {
      case "nameError":
        return !value ? "El nombre es obligatorio." : "";
      case "benefitsError":
        return !value ? "La descripción de los beneficios es obligatoria." : "";
      case "discountThreeMonthsError":
        return value > 100
          ? "El porcentaje de descuento debe ser menor o igual a 100."
          : "";
      case "discountSixMonthsError":
        return value > 100
          ? "El porcentaje de descuento debe ser menor o igual a 100."
          : "";
      case "discountTwelveMonthsError":
        return value > 100
          ? "El porcentaje de descuento debe ser menor o igual a 100."
          : "";
      case "maxProjectsError":
        return value <= 0 ? "Debe haber al menos 1 propiedad." : "";
      default:
        return "";
    }
  };

  const validateField = async (fieldName: keyof typeof errors, value: any) => {
    let errorMessage = getErrorMessage(fieldName, value);

    if (fieldName === "nameError" && value) {
      const total = await checkName(
        "membership",
        value,
        isEdit ? membership.id : undefined
      );
      if (total > 0) {
        errorMessage = "El nombre de la membresía ya está en uso, elige otro.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = async () => {
    const newErrors: typeof errors = {
      nameError: getErrorMessage("nameError", membership.name),
      benefitsError: getErrorMessage("benefitsError", membership.benefits),
      discountThreeMonthsError: getErrorMessage(
        "discountThreeMonthsError",
        membership.discountThreeMonths
      ),
      discountSixMonthsError: getErrorMessage(
        "discountSixMonthsError",
        membership.discountSixMonths
      ),
      discountTwelveMonthsError: getErrorMessage(
        "discountTwelveMonthsError",
        membership.discountTwelveMonths
      ),
      maxProjectsError: getErrorMessage(
        "maxProjectsError",
        membership.maxProjects
      ),
    };

    if (membership.name) {
      const total = await checkName(
        "membership",
        membership.name,
        isEdit ? membership.id : undefined
      );
      if (total > 0) {
        newErrors.nameError =
          "El nombre de la membresía ya está en uso, elige otro.";
      }
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
};
