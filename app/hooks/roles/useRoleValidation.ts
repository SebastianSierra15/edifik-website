import { useState } from "react";
import { useCheckName } from "../checkName/useCheckName";

export const useRoleValidation = (role: any, isEdit: boolean) => {
  const [errors, setErrors] = useState({
    nameError: "",
    permissionsError: "",
  });

  const { checkName } = useCheckName();

  const getErrorMessage = (fieldName: keyof typeof errors, value: any) => {
    switch (fieldName) {
      case "nameError":
        return !value ? "El nombre del rol es obligatorio." : "";
      case "permissionsError":
        return !value || value.length === 0
          ? "El rol debe tener al menos un permiso asignado."
          : "";
      default:
        return "";
    }
  };

  const validateField = async (fieldName: keyof typeof errors, value: any) => {
    let errorMessage = getErrorMessage(fieldName, value);

    if (fieldName === "nameError" && value) {
      const total = await checkName(
        "role",
        value,
        isEdit ? role.id : undefined
      );

      if (total > 0) {
        errorMessage = "El nombre del rol ya está en uso, elige otro.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = async () => {
    const newErrors: typeof errors = {
      nameError: getErrorMessage("nameError", role.name),
      permissionsError: getErrorMessage("permissionsError", role.permissions),
    };

    if (role.name) {
      const total = await checkName(
        "role",
        role.name,
        isEdit ? role.id : undefined
      );

      if (total > 0) {
        newErrors.nameError = "El nombre del rol ya está en uso, elige otro.";
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
};
