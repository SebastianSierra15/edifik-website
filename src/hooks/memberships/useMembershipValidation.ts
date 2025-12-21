import { useState } from "react";
import { Membership, NameValidationTarget } from "@/src/interfaces";
import { useCheckName } from "../checkName";

type MembershipErrors = {
  nameError: string;
  benefitsError: string;
  discountThreeMonthsError: string;
  discountSixMonthsError: string;
  discountTwelveMonthsError: string;
  maxProjectsError: string;
};

export const useMembershipValidation = (
  membership: Membership,
  isEdit: boolean
) => {
  const { checkName } = useCheckName();

  const [errors, setErrors] = useState<MembershipErrors>({
    nameError: "",
    benefitsError: "",
    discountThreeMonthsError: "",
    discountSixMonthsError: "",
    discountTwelveMonthsError: "",
    maxProjectsError: "",
  });

  const getErrorMessage = (
    fieldName: keyof MembershipErrors,
    value: any
  ): string => {
    switch (fieldName) {
      case "nameError":
        return !value ? "El nombre es obligatorio." : "";

      case "benefitsError":
        return !value ? "La descripción de los beneficios es obligatoria." : "";

      case "discountThreeMonthsError":
      case "discountSixMonthsError":
      case "discountTwelveMonthsError":
        return value !== null && value > 100
          ? "El porcentaje de descuento debe ser menor o igual a 100."
          : "";

      case "maxProjectsError":
        return value <= 0 ? "Debe haber al menos 1 propiedad." : "";

      default:
        return "";
    }
  };

  const validateField = async (
    fieldName: keyof MembershipErrors,
    value: any
  ) => {
    let errorMessage = getErrorMessage(fieldName, value);

    if (fieldName === "nameError" && value) {
      const total = await checkName(
        NameValidationTarget.Membership,
        value,
        isEdit ? membership.id : undefined
      );

      if (total > 0) {
        errorMessage = "El nombre de la membresía ya está en uso, elige otro.";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = async (): Promise<boolean> => {
    const newErrors: MembershipErrors = {
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
        NameValidationTarget.Membership,
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

  return {
    errors,
    validateField,
    validateFields,
  };
};
