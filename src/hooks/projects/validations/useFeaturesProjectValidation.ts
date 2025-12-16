import { useState } from "react";
import type { ProjectDetails } from "@/src/interfaces";

type FeatureErrors = Record<string, string>;

export function useFeaturesProjectValidation(formData: ProjectDetails) {
  const [errors, setErrors] = useState<FeatureErrors>({});

  const validateField = (field: string, value: unknown) => {
    setErrors((prev) => ({
      ...prev,
      [field]: value ? "" : "Campo obligatorio.",
    }));
  };

  const validateFields = (): boolean => {
    const newErrors: FeatureErrors = {};

    if (!formData.totalArea) {
      newErrors.totalArea = "El área total es obligatoria.";
    }

    if (!formData.builtArea) {
      newErrors.builtArea = "El área construida es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validateField, validateFields };
}
