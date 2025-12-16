import { useState } from "react";
import type { ImageType, Media } from "@/src/interfaces";

export function useImagesProjectValidation(
  media: Media[],
  imageTypes: ImageType[]
) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (key: string, value: string) => {
    setErrors((prev) => ({
      ...prev,
      [key]: value ? "" : "Campo obligatorio.",
    }));
  };

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    imageTypes.forEach((type) => {
      const hasImage = media.some((m) => m.tag === type.name);
      if (type.isRequired && !hasImage) {
        newErrors[type.name] =
          `Debe subir al menos una imagen para ${type.name}.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validateField, validateFields };
}
