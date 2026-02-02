"use client";

import { useMemo, useState } from "react";
import type { ImageType, Media, ProjectFormData } from "@/src/interfaces";
import { getImagesProjectSchema as getProjectImagesProjectSchema } from "@/src/schemas/admin/proyectos/images-project.schema";
import { getImagesProjectSchema as getPropertyImagesProjectSchema } from "@/src/schemas/admin/inmobiliaria/images-project.schema";

export function useImagesProjectValidation(
  formData: ProjectFormData,
  imagesTypes: ImageType[],
  isProperty: boolean
) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const imagesByCategory: Record<string, Media[]> = {};
  const imageDescriptionsByCategory: Record<string, string[]> = {};
  const schema = useMemo(() => {
    const getSchema = isProperty
      ? getPropertyImagesProjectSchema
      : getProjectImagesProjectSchema;
    return getSchema({
      imagesTypes,
      requirePlanDescription: !isProperty,
    });
  }, [imagesTypes, isProperty]);

  (formData.media || []).forEach((media) => {
    if (!media.type) return;

    if (!imagesByCategory[media.type]) {
      imagesByCategory[media.type] = [];
      imageDescriptionsByCategory[media.type] = [];
    }

    imagesByCategory[media.type].push(media);
    imageDescriptionsByCategory[media.type].push(media.description || "");
  });

  const getErrorMessage = (fieldName: string) => {
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
    const result = schema.safeParse({
      media: formData.media ?? [],
      commonAreas: formData.commonAreas ?? [],
      videoUrl: formData.videoUrl ?? undefined,
    });

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !newErrors[key]) {
          newErrors[key] = issue.message;
        }
      }
    }

    setErrors({ ...newErrors });

    return Object.keys(newErrors).length === 0;
  };

  const validateVideoUrl = (value: string | undefined) => {
    const result = schema.safeParse({
      media: formData.media ?? [],
      commonAreas: formData.commonAreas ?? [],
      videoUrl: value,
    });

    const videoIssue = result.success
      ? undefined
      : result.error.issues.find((issue) => issue.path[0] === "videoUrl");

    setErrors((prevErrors) => {
      const nextErrors = { ...prevErrors };

      if (value && videoIssue) {
        nextErrors.videoUrl = videoIssue.message;
      } else {
        delete nextErrors.videoUrl;
      }

      return nextErrors;
    });

    return !videoIssue;
  };

  return { errors, validateFields, validateField, validateVideoUrl };
}
