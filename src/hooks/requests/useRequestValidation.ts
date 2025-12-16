import { useState } from "react";

export const useRequestValidation = () => {
  const [errors, setErrors] = useState<{
    messageError: string;
    actionTypeError: string;
  }>({
    messageError: "",
    actionTypeError: "",
  });

  const getErrorMessage = (fieldName: keyof typeof errors, value: string) => {
    switch (fieldName) {
      case "messageError":
        return value.trim() ? "" : "El mensaje de respuesta es obligatorio.";
      case "actionTypeError":
        return ["approve", "reject", "revision"].includes(value)
          ? ""
          : "Debe seleccionar un estado válido.";
      default:
        return "";
    }
  };

  const validateField = (fieldName: keyof typeof errors, value: string) => {
    const errorMessage = getErrorMessage(fieldName, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = (message: string, actionType: string) => {
    const newErrors = {
      messageError: getErrorMessage("messageError", message),
      actionTypeError: getErrorMessage("actionTypeError", actionType),
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
};
