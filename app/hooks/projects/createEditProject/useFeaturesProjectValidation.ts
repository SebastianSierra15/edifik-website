import { useState } from "react";
import { ProjectData } from "@/lib/definitios";

export const useFeaturesProjectValidation = (formData: ProjectData) => {
  const [errors, setErrors] = useState({
    builtAreaError: "",
    totalAreaError: "",
    bathroomsError: "",
    bedroomsError: "",
    lobbiesError: "",
    freeHeightError: "",
    widthError: "",
    lengthError: "",
    towersError: "",
    socioeconomicLevelError: "",
    yearBuiltError: "",
  });

  const shouldShowField = (field: string) => {
    const propertyTypeId = formData.propertyType?.id;

    const fieldsFor1001And1002 = [
      "socioeconomicLevel",
      "yearBuilt",
      "bedrooms",
      "storageUnits",
      "balcony",
      "laundryArea",
      "customizationOptions",
    ];

    const fieldsFor1001 = ["terrace", "garden"];
    const fieldsFor1001_1002_1004 = ["bathrooms", "lobbies"];
    const fieldsFor1002_1003_1004 = ["elevator"];
    const fieldsFor1002 = ["towers", "floorNumber"];
    const fieldsFor1004_1003_1005 = ["freeHeight"];
    const fieldsFor1005_1006_1007 = ["width", "length"];
    const fieldsFor1005 = ["heavyParking"];

    if (fieldsFor1001And1002.includes(field)) {
      return propertyTypeId === 1001 || propertyTypeId === 1002;
    }
    if (fieldsFor1001.includes(field)) {
      return propertyTypeId === 1001;
    }
    if (fieldsFor1001_1002_1004.includes(field)) {
      return (
        propertyTypeId === 1001 ||
        propertyTypeId === 1002 ||
        propertyTypeId === 1004
      );
    }
    if (fieldsFor1002_1003_1004.includes(field)) {
      return (
        propertyTypeId === 1002 ||
        propertyTypeId === 1003 ||
        propertyTypeId === 1004
      );
    }
    if (fieldsFor1002.includes(field)) {
      return propertyTypeId === 1002;
    }
    if (fieldsFor1004_1003_1005.includes(field)) {
      return (
        propertyTypeId === 1004 ||
        propertyTypeId === 1003 ||
        propertyTypeId === 1005
      );
    }
    if (fieldsFor1005_1006_1007.includes(field)) {
      return (
        propertyTypeId === 1005 ||
        propertyTypeId === 1006 ||
        propertyTypeId === 1007
      );
    }
    if (fieldsFor1005.includes(field)) {
      return propertyTypeId === 1005;
    }

    return true;
  };

  const getErrorMessage = (fieldName: keyof typeof errors, value: any) => {
    switch (fieldName) {
      case "builtAreaError":
        return !value ? "El área construida es obligatoria." : "";
      case "totalAreaError":
        return !value ? "El área total es obligatoria." : "";
      case "bathroomsError":
        return !value ? "El número de baños es obligatorio." : "";
      case "bedroomsError":
        return !value ? "El número de habitaciones es obligatorio." : "";
      case "lobbiesError":
        return !value ? "El número de salas de estar es obligatorio." : "";
      case "freeHeightError":
        return !value ? "La altura libre es obligatoria." : "";
      case "widthError":
        return !value ? "El ancho es obligatorio." : "";
      case "lengthError":
        return !value ? "El largo es obligatorio." : "";
      case "towersError":
        return formData.projectType?.id === 1 && !value
          ? "El número de torres es obligatorio."
          : "";
      case "socioeconomicLevelError":
        return (formData.projectType?.id === 2 ||
          formData.projectType?.id === 3) &&
          !value
          ? "El estrato es obligatorio."
          : "";
      case "yearBuiltError":
        return (formData.projectType?.id === 2 ||
          formData.projectType?.id === 3) &&
          !value
          ? "El año de construcción es obligatorio."
          : "";
      default:
        return "";
    }
  };

  const validateField = (fieldName: keyof typeof errors, value: any) => {
    const field = fieldName.replace("Error", "");
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: shouldShowField(field)
        ? getErrorMessage(fieldName, value)
        : "",
    }));
  };

  const validateFields = () => {
    const newErrors: Partial<typeof errors> = {};

    Object.keys(errors).forEach((errorKey) => {
      const fieldName = errorKey.replace("Error", "");
      if (shouldShowField(fieldName)) {
        newErrors[errorKey as keyof typeof errors] = getErrorMessage(
          errorKey as keyof typeof errors,
          formData[fieldName as keyof ProjectData]
        );
      } else {
        newErrors[errorKey as keyof typeof errors] = "";
      }
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));

    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, validateFields, validateField };
};
