"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { PropertyData, ImageType } from "@/lib/definitios";
import ImageUploadSection from "./ImageUploadSection";
import StepNavigationButtons from "../../stepNavigationButtons";

type UploadImagesFormProps = {
  formData: PropertyData;
  onChange: (updatedData: Partial<PropertyData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  imagesTypes: ImageType[];
  onSubmit: (
    imagesMatrix: File[][],
    imageTypesArray: {
      type: string;
      id: number;
      category: "imageType" | "commonArea";
    }[]
  ) => void;
};

export default function ImagesPropertyForm({
  formData,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  imagesTypes,
  onSubmit,
}: UploadImagesFormProps) {
  const [images, setImages] = useState<Record<string, File[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [imageTags, setImageTags] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    [...imagesTypes, ...(formData.commonAreas || [])].forEach((item) => {
      initialExpandedState[item.name] = false;
    });
    setExpandedSections(initialExpandedState);
  }, [imagesTypes, formData]);

  const toggleSection = (category: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleImageChange = (
    category: string,
    event: ChangeEvent<HTMLInputElement>,
    maxImages: number
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    const currentImages = images[category] || [];

    if (currentImages.length + selectedFiles.length > maxImages) {
      setErrors((prev) => ({
        ...prev,
        [category]: `Máximo ${maxImages} imágenes permitidas para esta categoría.`,
      }));
      return;
    }

    setImages((prev) => ({
      ...prev,
      [category]: [...currentImages, ...selectedFiles],
    }));
    setErrors((prev) => ({ ...prev, [category]: "" }));

    setImageTags((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), ...selectedFiles.map(() => "")],
    }));
  };

  const handleRemoveImage = (category: string, index: number) => {
    const updatedImages = [...(images[category] || [])];
    updatedImages.splice(index, 1);
    setImages((prev) => ({ ...prev, [category]: updatedImages }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    imagesTypes
      .filter((type) => type.isRequired)
      .forEach((item) => {
        if (!images[item.name] || images[item.name].length === 0) {
          newErrors[
            item.name
          ] = `Debe subir al menos una imagen para ${item.name}.`;
        }
      });

    formData.commonAreas?.forEach((area) => {
      if (!images[area.name] || images[area.name].length === 0) {
        newErrors[
          area.name
        ] = `Debe subir al menos una imagen para ${area.name}.`;
      }
    });

    Object.entries(imageTags).forEach(([category, tags]) => {
      tags.forEach((tag, index) => {
        if (!tag) {
          newErrors[`${category}-tag-${index}`] = `Etiqueta obligatoria.`;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const transformImages = () => {
    const imagesMatrix: File[][] = [];
    const imageTypesArray: {
      type: string;
      id: number;
      category: "imageType" | "commonArea";
    }[] = [];

    Object.entries(images).forEach(([type, files]) => {
      imagesMatrix.push(files);

      const imageType = imagesTypes.find((imgType) => imgType.name === type);
      const commonArea = formData.commonAreas?.find(
        (area) => area.name === type
      );

      if (imageType) {
        imageTypesArray.push({
          type: imageType.name,
          id: imageType.id,
          category: "imageType",
        });
      } else if (commonArea) {
        imageTypesArray.push({
          type: commonArea.name,
          id: commonArea.id,
          category: "commonArea",
        });
      }
    });

    return { imagesMatrix, imageTypesArray };
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const { imagesMatrix, imageTypesArray } = transformImages();
      onSubmit(imagesMatrix, imageTypesArray);
      onNext();
    }
  };

  const handleTagChange = (category: string, index: number, tag: string) => {
    setImageTags((prev) => {
      const updatedTags = { ...prev };
      const categoryTags = [...(updatedTags[category] || [])];
      categoryTags[index] = tag;
      updatedTags[category] = categoryTags;
      return updatedTags;
    });
  };

  return (
    <div className="container mx-auto max-w-2xl p-6 bg-backgroundLight dark:bg-backgroundDark rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary dark:text-primaryLight text-center mb-6">
        Subir Imágenes de la Propiedad
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-6"
      >
        {imagesTypes.map((type) => (
          <ImageUploadSection
            key={type.name}
            name={type.name}
            description={type.description}
            maxImages={type.maxImagesAllowed}
            titleSize="lg"
            expanded={expandedSections[type.name]}
            images={images[type.name] || []}
            tags={imageTags[type.name] || []}
            error={errors[type.name] || null}
            onToggleExpand={() => toggleSection(type.name)}
            onImageChange={(e) =>
              handleImageChange(type.name, e, type.maxImagesAllowed)
            }
            onRemoveImage={(index) => handleRemoveImage(type.name, index)}
            onTagChange={(index, newTag) =>
              handleTagChange(type.name, index, newTag)
            }
          />
        ))}

        <StepNavigationButtons
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={onPrevious}
          onNext={handleSubmit}
        />
      </form>
    </div>
  );
}
