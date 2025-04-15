import { useState } from "react";
import { useCheckName } from "../checkName/useCheckName";

export const useUserValidation = (user: any, isEdit: boolean) => {
  const [errors, setErrors] = useState({
    namesError: "",
    lastnamesError: "",
    emailError: "",
    phoneNumberError: "",
    genderError: "",
    roleError: "",
    membershipError: "",
  });
  const { checkName } = useCheckName();

  const getErrorMessage = (fieldName: keyof typeof errors, value: any) => {
    switch (fieldName) {
      case "namesError":
        return !value ? "El nombre es obligatorio." : "";
      case "lastnamesError":
        return !value ? "El apellido es obligatorio." : "";
      case "emailError":
        return !value
          ? "El correo electrónico es obligatorio."
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? "El correo electrónico no es válido."
            : "";
      case "phoneNumberError":
        return !value
          ? "El número de teléfono es obligatorio."
          : !/^\d{10}$/.test(value)
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

  const validateField = async (fieldName: keyof typeof errors, value: any) => {
    let errorMessage = getErrorMessage(fieldName, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = async () => {
    const newErrors: typeof errors = {
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
};
