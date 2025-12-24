"use client";

import { useState } from "react";
import type { ImageType, Media, ProjectFormData } from "@/src/interfaces";

export function useImagesProjectValidation(
  formData: ProjectFormData,
  imagesTypes: ImageType[]
) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const imagesByCategory: Record<string, Media[]> = {};
  const imageTagsByCategory: Record<string, string[]> = {};
  const imageDescriptionsByCategory: Record<string, string[]> = {};

  (formData.media || []).forEach((media) => {
    if (!media.type) return;

    if (!imagesByCategory[media.type]) {
      imagesByCategory[media.type] = [];
      imageTagsByCategory[media.type] = [];
      imageDescriptionsByCategory[media.type] = [];
    }

    imagesByCategory[media.type].push(media);
    imageTagsByCategory[media.type].push(media.tag);
    imageDescriptionsByCategory[media.type].push(media.description || "");
  });

  const getErrorMessage = (fieldName: string) => {
    if (fieldName.includes("-tag-")) {
      return "El nombre de la imagen es obligatorio.";
    }
    if (fieldName.includes("-description-")) {
      return "La descripción es obligatoria.";
    }
    return "Campo obligatorio.";
  };

  const validateField = (fieldName: string, value: string) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (value.trim() === "") {
        newErrors[fieldName] = getErrorMessage(fieldName);
      } else {
        delete newErrors[fieldName];
      }

      return JSON.stringify(prevErrors) !== JSON.stringify(newErrors)
        ? { ...newErrors }
        : prevErrors;
    });
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    imagesTypes.forEach((type) => {
      if (
        type.isRequired &&
        (!imagesByCategory[type.name] ||
          imagesByCategory[type.name].length === 0)
      ) {
        newErrors[type.name] =
          `Debe subir al menos una imagen para ${type.name}.`;
      }
    });

    formData.commonAreas?.forEach((area) => {
      if (
        !imagesByCategory[area.name] ||
        imagesByCategory[area.name].length === 0
      ) {
        newErrors[area.name] =
          `Debe subir al menos una imagen para ${area.name}.`;
      }
    });

    Object.entries(imagesByCategory).forEach(([category, files]) => {
      files.forEach((_, index) => {
        if (!imageTagsByCategory[category]?.[index]) {
          newErrors[`${category}-tag-${index}`] =
            "El nombre de la imagen es obligatorio.";
        }

        if (
          imagesTypes.find((type) => type.name === category)?.id === 1005 &&
          !imageDescriptionsByCategory[category]?.[index]
        ) {
          newErrors[`${category}-description-${index}`] =
            "La descripción es obligatoria.";
        }
      });
    });

    setErrors({ ...newErrors });

    return Object.keys(newErrors).length === 0;
  };

  return { errors, validateFields, validateField };
}
