"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { PropertyData, ImageType } from "@/lib/definitios";
import {
  AiOutlineClose,
  AiOutlineExclamationCircle,
  AiOutlineDown,
} from "react-icons/ai";
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

  const renderImageUploadSection = (
    name: string,
    description?: string,
    maxImages: number = 4,
    titleSize: string = "base"
  ) => (
    <div
      key={name}
      className={`pb-1 rounded-md bg-backgroundAlt dark:bg-backgroundDarkAlt hover:bg-backgroundLight hover:dark:bg-backgroundLight ${
        errors[name] ? "border border-red-500" : "border-none"
      }`}
    >
      <div
        className="flex justify-between items-center cursor-pointer p-4"
        onClick={() => toggleSection(name)}
      >
        <h4 className={`text-${titleSize} font-semibold text-textPrimary`}>
          {name}
        </h4>
        <AiOutlineDown
          className={`${
            expandedSections[name] ? "rotate-180" : ""
          } transition-transform duration-300 text-textPrimary dark:text-textSecondary`}
        />
      </div>

      {description && (
        <p
          className="text-sm text-gray-600 dark:text-gray-400 -mt-3 mb-4 px-4 cursor-pointer"
          onClick={() => toggleSection(name)}
        >
          {description}
        </p>
      )}

      {expandedSections[name] && (
        <div className="px-4 pb-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageChange(name, e, maxImages)}
            className={`w-full px-3 py-2 rounded-lg bg-backgroundDark dark:bg-background text-textPrimary mt-2 ${
              errors[name] ? "border-red-500" : "border-none"
            }`}
          />
          <p className="mt-1 ml-2 text-sm text-gray-600 dark:text-gray-400">
            {images[name]?.length || 0} archivo(s) subido(s)
          </p>

          {errors[name] && (
            <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
              <AiOutlineExclamationCircle className="w-5 h-5" />
              {errors[name]}
            </div>
          )}
          <div className="flex flex-wrap mt-2">
            {images[name]?.map((file, index) => (
              <div
                key={index}
                className="relative m-1 w-20 h-20 bg-cover bg-center rounded-md"
                style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }}
              >
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-textPrimary dark:bg-textSecondary bg-opacity-50 text-white rounded-full p-1"
                  onClick={() => handleRemoveImage(name, index)}
                >
                  <AiOutlineClose className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

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
        {imagesTypes.map((type) =>
          renderImageUploadSection(
            type.name,
            type.description,
            type.maxImagesAllowed,
            "lg"
          )
        )}

        {Array.isArray(formData.commonAreas) &&
          formData.commonAreas.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-textPrimary dark:text-textPrimary">
                Imágenes por Áreas Comunes
              </h3>
              <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">
                Sube imágenes relevantes de cada área común para proporcionar
                más información visual a los usuarios.
              </p>

              {formData.commonAreas?.map((area) =>
                renderImageUploadSection(area.name, undefined, 4, "base")
              )}
            </div>
          )}

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
