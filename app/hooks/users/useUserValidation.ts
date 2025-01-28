import { useState } from "react";
import { useCheckName } from "../checkName/useCheckName";

export const useUserValidation = (user: any, isEdit: boolean) => {
  const [errors, setErrors] = useState({
    usernameError: "",
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
      case "usernameError":
        return !value ? "El nombre de usuario es obligatorio." : "";
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

    if (fieldName === "usernameError" && value) {
      const total = await checkName(
        "user",
        value,
        isEdit ? user.id : undefined
      );
      if (total > 0) {
        errorMessage = "El nombre de usuario ya está en uso, elige otro.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = async () => {
    const newErrors: typeof errors = {
      usernameError: getErrorMessage("usernameError", user.username),
      namesError: getErrorMessage("namesError", user.names),
      lastnamesError: getErrorMessage("lastnamesError", user.lastnames),
      emailError: getErrorMessage("emailError", user.email),
      phoneNumberError: getErrorMessage("phoneNumberError", user.phoneNumber),
      genderError: getErrorMessage("genderError", user.gender?.id),
      roleError: getErrorMessage("roleError", user.role?.id),
      membershipError: getErrorMessage("membershipError", user.membership?.id),
    };

    if (user.username) {
      const total = await checkName(
        "user",
        user.username,
        isEdit ? user.id : undefined
      );
      if (total > 0) {
        newErrors.usernameError =
          "El nombre de usuario ya está en uso, elige otro.";
      }
    }

    setErrors(newErrors);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(newErrors).every((error) => error === ""));
      }, 0);
    });
  };

  return { errors, validateFields, validateField };
};
