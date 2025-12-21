import { useState } from "react";
import type { User } from "@/src/interfaces";

type UserFormState = Partial<User>;

type UserValidationErrors = {
  namesError: string;
  lastnamesError: string;
  emailError: string;
  phoneNumberError: string;
  genderError: string;
  roleError: string;
  membershipError: string;
};

export function useUserValidation(user: UserFormState, isEdit: boolean) {
  const [errors, setErrors] = useState<UserValidationErrors>({
    namesError: "",
    lastnamesError: "",
    emailError: "",
    phoneNumberError: "",
    genderError: "",
    roleError: "",
    membershipError: "",
  });

  const getErrorMessage = (
    fieldName: keyof UserValidationErrors,
    value: unknown
  ) => {
    switch (fieldName) {
      case "namesError":
        return !value ? "El nombre es obligatorio." : "";
      case "lastnamesError":
        return !value ? "El apellido es obligatorio." : "";
      case "emailError":
        return !value
          ? "El correo electrónico es obligatorio."
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
            ? "El correo electrónico no es válido."
            : "";
      case "phoneNumberError":
        return !value
          ? "El número de teléfono es obligatorio."
          : !/^\d{10}$/.test(String(value))
            ? "El número de teléfono debe tener 10 dígitos."
            : "";
      case "genderError":
        return !value ? "El género es obligatorio." : "";
      case "roleError":
        return !value ? "El rol es obligatorio." : "";
      case "membershipError":
        return !value ? "La membresía es obligatoria." : "";
      default:
        return "";
    }
  };

  const validateField = async (
    fieldName: keyof UserValidationErrors,
    value: unknown
  ) => {
    const errorMessage = getErrorMessage(fieldName, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = async (): Promise<boolean> => {
    const newErrors: UserValidationErrors = {
      namesError: getErrorMessage("namesError", user.names),
      lastnamesError: getErrorMessage("lastnamesError", user.lastnames),
      emailError: getErrorMessage("emailError", user.email),
      phoneNumberError: getErrorMessage("phoneNumberError", user.phoneNumber),
      genderError: getErrorMessage("genderError", user.gender?.id),
      roleError: getErrorMessage("roleError", user.role?.id),
      membershipError: getErrorMessage("membershipError", user.membership?.id),
    };

    setErrors(newErrors);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(newErrors).every((error) => error === ""));
      }, 0);
    });
  };

  return { errors, validateFields, validateField };
}
