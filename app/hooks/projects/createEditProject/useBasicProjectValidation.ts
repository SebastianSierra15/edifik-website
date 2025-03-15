import { useState } from "react";
import { ProjectData } from "@/lib/definitios";
import { useCheckName } from "../../checkName/useCheckName";

export const useBasicProjectValidation = (
  formData: ProjectData,
  isProperty: boolean,
  isEdit: boolean
) => {
  const [errors, setErrors] = useState({
    nameError: "",
    emailError: "",
    shortDescriptionError: "",
    detailedDescriptionError: "",
    propertyTypeError: "",
    projectTypeError: "",
  });

  const { checkName } = useCheckName();

  const getErrorMessage = (fieldName: keyof typeof errors, value: any) => {
    switch (fieldName) {
      case "emailError":
        if (isProperty && value) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return "Ingrese un correo electrónico válido.";
          }
          if (!formData.ownerId) {
            return "El correo ingresado no pertenece a un usuario registrado.";
          }
        }
        return "";
      case "emailError":
        return !value ? "El usuario es obligatorio." : "";
      case "shortDescriptionError":
        return !value ? "El resumen breve es obligatorio." : "";
      case "detailedDescriptionError":
        return !value ? "La descripción completa es obligatoria." : "";
      case "propertyTypeError":
        return !value || !value.id ? "Seleccione el tipo de propiedad." : "";
      case "projectTypeError":
        return isProperty && (!value || !value.id)
          ? "Seleccione la finalidad de la propiedad."
          : "";
      default:
        return "";
    }
  };

  const validateField = async (fieldName: keyof typeof errors, value: any) => {
    let errorMessage = getErrorMessage(fieldName, value);

    if (!isProperty && fieldName === "nameError" && value) {
      const startCheckName = performance.now(); // Inicia medición del tiempo de verificación de nombre

      const total = await checkName(
        "project",
        value,
        isEdit ? formData.id : undefined
      );

      const endCheckName = performance.now(); // Finaliza medición del tiempo de verificación de nombre
      console.log(
        `⏱️ Tiempo de verificación de nombre: ${(endCheckName - startCheckName).toFixed(2)}ms`
      );

      if (total) {
        errorMessage = "El nombre del proyecto ya está en uso, elige otro.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateFields = async () => {
    const newErrors: typeof errors = {
      nameError: getErrorMessage("nameError", formData.name),
      emailError: getErrorMessage("emailError", formData.email),
      shortDescriptionError: getErrorMessage(
        "shortDescriptionError",
        formData.shortDescription
      ),
      detailedDescriptionError: getErrorMessage(
        "detailedDescriptionError",
        formData.detailedDescription
      ),
      propertyTypeError: getErrorMessage(
        "propertyTypeError",
        formData.propertyType
      ),
      projectTypeError: getErrorMessage(
        "projectTypeError",
        formData.projectType
      ),
    };

    if (formData.email && !formData.ownerId) {
      const foundUser = await checkName("user", formData.email);
      if (!foundUser) {
        newErrors.emailError =
          "El correo ingresado no pertenece a un usuario registrado.";
      }
    }

    if (!isProperty && formData.name) {
      const startCheckName = performance.now(); // Inicia medición del tiempo de verificación de nombre

      const total = await checkName(
        "project",
        formData.name,
        isEdit ? formData.id : undefined
      );

      const endCheckName = performance.now(); // Finaliza medición del tiempo de verificación de nombre
      console.log(
        `⏱️ Tiempo de verificación de nombre: ${(endCheckName - startCheckName).toFixed(2)}ms`
      );

      if (total) {
        newErrors.nameError =
          "El nombre del proyecto ya está en uso, elige otro.";
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
};
