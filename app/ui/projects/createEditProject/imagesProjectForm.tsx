"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { ProjectData, ImageType, Media } from "@/lib/definitios";
import ImageUploadSection from "./ImageUploadSection";
import StepNavigationButtons from "../../admin/stepNavigationButtons";
import ModalAlert from "../../modals/modalAlert";

type UploadImagesFormProps = {
  formData: ProjectData;
  onChange: (updatedData: Partial<ProjectData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  imagesTypes: ImageType[];
  onSubmit: (media: Media[]) => void;
};

export default function ImagesProjectForm({
  formData,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  imagesTypes,
  onSubmit,
}: UploadImagesFormProps) {
  const [images, setImages] = useState<Record<string, File[]>>({});
  const [imageDescriptions, setImageDescriptions] = useState<
    Record<string, string[]>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [imageTags, setImageTags] = useState<Record<string, string[]>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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
    maxImages: number,
  ) => {
    const maxFileSize = 3 * 1024 * 1024;
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    selectedFiles.forEach((file) => {
      if (file.size <= maxFileSize) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      setAlertMessage(
        "Algunas imágenes superan el límite de tamaño de 3MB y no se cargarán.",
      );
      setShowAlert(true);
    }

    const currentImages = images[category] || [];
    const currentDescriptions = imageDescriptions[category] || [];

    if (currentImages.length + validFiles.length > maxImages) {
      setErrors((prev) => ({
        ...prev,
        [category]: `Máximo ${maxImages} imágenes permitidas para esta categoría.`,
      }));
      return;
    }

    setImages((prev) => ({
      ...prev,
      [category]: [...currentImages, ...validFiles],
    }));
    setErrors((prev) => ({ ...prev, [category]: "" }));

    setImageTags((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), ...validFiles.map(() => "")],
    }));

    setImageDescriptions((prev) => ({
      ...prev,
      [category]: [...currentDescriptions, ...validFiles.map(() => "")],
    }));

    event.target.value = "";
  };

  const handleRemoveImage = (category: string, index: number) => {
    const updatedImages = [...(images[category] || [])];
    updatedImages.splice(index, 1);

    const updatedTags = [...(imageTags[category] || [])];
    updatedTags.splice(index, 1);

    const updatedDescriptions = [...(imageDescriptions[category] || [])];
    updatedDescriptions.splice(index, 1);

    setImages((prev) => ({ ...prev, [category]: updatedImages }));
    setImageTags((prev) => ({ ...prev, [category]: updatedTags }));
    setImageDescriptions((prev) => ({
      ...prev,
      [category]: updatedDescriptions,
    }));
  };

  const handleDescriptionChange = (
    category: string,
    index: number,
    description: string,
  ) => {
    setImageDescriptions((prev) => {
      const updatedDescriptions = [...(prev[category] || [])];
      updatedDescriptions[index] = description;
      return {
        ...prev,
        [category]: updatedDescriptions,
      };
    });

    if (description.length > 150) {
      setErrors((prev) => ({
        ...prev,
        [`${category}-description`]:
          "La descripción no puede superar los 150 caracteres.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [`${category}-description`]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    imagesTypes
      .filter((type) => type.isRequired)
      .forEach((item) => {
        if (!images[item.name] || images[item.name].length === 0) {
          newErrors[item.name] =
            `Debe subir al menos una imagen para ${item.name}.`;
        }
      });

    formData.commonAreas?.forEach((area) => {
      if (!images[area.name] || images[area.name].length === 0) {
        newErrors[area.name] =
          `Debe subir al menos una imagen para ${area.name}.`;
      }
    });

    Object.entries(images).forEach(([category, files]) => {
      files.forEach((_, index) => {
        const tag = imageTags[category]?.[index];
        const description = imageDescriptions[category]?.[index];
        const imageType = imagesTypes.find((type) => type.name === category);

        if (!tag || tag.trim() === "") {
          newErrors[`${category}-tag-${index}`] =
            "El nombre de la imagen es obligatorio.";
        }

        if (
          imageType?.id === 1005 &&
          (!description || description.trim() === "")
        ) {
          newErrors[`${category}-description-${index}`] =
            "La descripción es obligatoria para esta imagen.";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const transformImagesToMedia = (): Media[] => {
    const mediaArray: Media[] = [];

    Object.entries(images).forEach(([type, files]) => {
      const imageType = imagesTypes.find((imgType) => imgType.name === type);
      const commonArea = formData.commonAreas?.find(
        (area) => area.name === type,
      );

      files.forEach((file, index) => {
        mediaArray.push({
          tag: imageTags[type][index] || "",
          file,
          description: imageDescriptions[type]?.[index] || "",
          idType: imageType ? imageType.id : commonArea?.id || 0,
          type: type,
          category: imageType ? "imageType" : "commonArea",
        });
      });
    });

    return mediaArray;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const mediaData = transformImagesToMedia();
      onSubmit(mediaData);
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
    <div className="container mx-auto max-w-2xl rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {formData.projectType?.id === 1
          ? "Subir Imágenes del Proyecto"
          : "Subir Imágenes de la Propiedad"}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-6"
      >
        {imagesTypes.map((type) => (
          <ImageUploadSection
            imageType={type}
            expanded={expandedSections[type.name]}
            images={images[type.name] || []}
            tags={imageTags[type.name] || []}
            descriptions={imageDescriptions[type.name] || []}
            error={errors[type.name] || null}
            errors={Object.keys(errors)
              .filter((key) => key.startsWith(`${type.name}-`))
              .reduce(
                (acc, key) => {
                  acc[key] = errors[key];
                  return acc;
                },
                {} as Record<string, string>,
              )}
            onToggleExpand={() => toggleSection(type.name)}
            onImageChange={(e) =>
              handleImageChange(type.name, e, type.maxImagesAllowed)
            }
            onRemoveImage={(index) => handleRemoveImage(type.name, index)}
            onTagChange={(index, newTag) =>
              handleTagChange(type.name, index, newTag)
            }
            onDescriptionChange={(index, newDescription) =>
              handleDescriptionChange(type.name, index, newDescription)
            }
          />
        ))}

        {formData.commonAreas && (
          <h3 className="mb-6 text-center text-xl font-bold text-premium-primary dark:text-premium-primaryLight">
            Subir imágenes de las áreas comunes
          </h3>
        )}

        {formData.commonAreas?.map((area) => (
          <ImageUploadSection
            key={area.name}
            imageType={{
              id: area.id,
              name: area.name,
              maxImagesAllowed: 5,
              isRequired: true,
            }}
            expanded={expandedSections[area.name] || false}
            images={images[area.name] || []}
            tags={imageTags[area.name] || []}
            descriptions={imageDescriptions[area.name] || []}
            error={errors[area.name] || null}
            errors={Object.keys(errors)
              .filter((key) => key.startsWith(`${area.name}-`))
              .reduce(
                (acc, key) => {
                  acc[key] = errors[key];
                  return acc;
                },
                {} as Record<string, string>,
              )}
            onToggleExpand={() => toggleSection(area.name)}
            onImageChange={(e) => handleImageChange(area.name, e, 5)}
            onRemoveImage={(index) => handleRemoveImage(area.name, index)}
            onTagChange={(index, newTag) =>
              handleTagChange(area.name, index, newTag)
            }
            onDescriptionChange={(index, newDescription) =>
              handleDescriptionChange(area.name, index, newDescription)
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

      <ModalAlert
        title="Advertencia"
        message={alertMessage}
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
}
