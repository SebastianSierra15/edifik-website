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
    shortDescriptionError: "",
    detailedDescriptionError: "",
    propertyTypeError: "",
    projectTypeError: "",
  });

  const { checkName } = useCheckName();

  const getErrorMessage = (fieldName: keyof typeof errors, value: any) => {
    switch (fieldName) {
      case "nameError":
        return !value ? "El nombre es obligatorio." : "";
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

    if (fieldName === "nameError" && value) {
      const total = await checkName(
        "project",
        value,
        isEdit ? formData.id : undefined
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

    if (formData.name) {
      const total = await checkName(
        "project",
        formData.name,
        isEdit ? formData.id : undefined
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
