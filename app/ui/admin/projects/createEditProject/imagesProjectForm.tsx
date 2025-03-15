"use client";

import { useState, ChangeEvent, useEffect, useCallback, useMemo } from "react";
import { ProjectData, ImageType, Media } from "@/lib/definitios";
import { useImagesProjectValidation } from "@/app/hooks/projects/createEditProject/useImagesProjectValidation";
import ImageUploadSection from "./imageUploadSection";
import StepNavigationButtons from "../../stepNavigationButtons";
import ModalAlert from "../../../modals/admin/modalAlert";

interface UploadImagesFormProps {
  formData: ProjectData;
  onChange: (updatedData: Partial<ProjectData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  imagesTypes: ImageType[];
  onSubmit: (media: Media[], validateFields: () => boolean) => void;
}

export default function ImagesProjectForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  imagesTypes,
  onSubmit,
}: UploadImagesFormProps) {
  const [initialized, setInitialized] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { errors, validateFields, validateField } = useImagesProjectValidation(
    formData,
    imagesTypes
  );

  const imagesByCategory = useMemo(() => {
    const grouped: Record<string, Media[]> = {};
    (formData.media || []).forEach((media) => {
      if (!grouped[media.type]) {
        grouped[media.type] = [];
      }
      grouped[media.type].push(media);
    });

    return grouped;
  }, [formData.media]);

  useEffect(() => {
    if (!formData.projectMedia || initialized) return;

    const transformedMedia: Media[] = formData.projectMedia.map((media) => ({
      id: media.id?.toString() || "",
      tag: media.tag || "",
      file: media.url.startsWith("http") ? media.url : new File([], media.url),
      description: media.description || "",
      idType: media.imageType || media.commonArea || 0,
      type: media.type || "",
      category: media.imageType ? "imageType" : "commonArea",
    }));

    onChange({ media: transformedMedia });
    setInitialized(true);
  }, [formData.projectMedia]);

  useEffect(() => {
    setExpandedSections(
      imagesTypes.reduce((acc, item) => ({ ...acc, [item.name]: false }), {})
    );
  }, [imagesTypes]);

  useEffect(() => {
    if (!formData.media || formData.media.length === 0) return;
    setTimeout(() => {
      validateFields();
    }, 100);
  }, [formData.media]);

  const toggleSection = useCallback((category: string) => {
    setExpandedSections((prev) => ({ ...prev, [category]: !prev[category] }));
  }, []);

  const handleImageChange = useCallback(
    (
      category: string,
      event: ChangeEvent<HTMLInputElement>,
      maxImages: number
    ) => {
      if (!event.target.files || event.target.files.length === 0) return;

      const selectedFiles = Array.from(event.target.files);

      const existingMediaCount =
        formData.media?.filter((m) => m.type === category).length || 0;

      if (existingMediaCount + selectedFiles.length > maxImages) {
        console.warn(
          `⚠️ No puedes subir más de ${maxImages} imágenes para ${category}`
        );
        return;
      }

      const newMedia = selectedFiles.map((file) => ({
        file,
        tag: "",
        description: "",
        idType: imagesTypes.find((type) => type.name === category)?.id ?? 0,
        type: category,
        category: "imageType",
      }));

      const updatedMedia = [...(formData.media || []), ...newMedia];

      onChange({ media: updatedMedia });
    },
    [onChange, formData.media, imagesTypes]
  );

  const handleRemoveImage = useCallback(
    (category: string, index: number) => {
      const imageToRemove = imagesByCategory[category]?.[index];
      if (!imageToRemove) {
        console.error(
          `❌ No se encontró la imagen en la categoría ${category}`
        );
        return;
      }

      const updatedMedia = (formData.media || []).filter(
        (media) => media.file !== imageToRemove.file
      );

      onChange({ media: updatedMedia });
    },
    [onChange, formData.media, imagesByCategory]
  );

  const handleTagChange = useCallback(
    (category: string, index: number, tag: string) => {
      if (!formData.media) return;

      const imageToUpdate = imagesByCategory[category]?.[index];
      if (!imageToUpdate) {
        console.error(
          `❌ No se encontró la imagen en ${category} con índice ${index}`
        );
        return;
      }

      const updatedMedia = formData.media.map((mediaItem) =>
        mediaItem.file === imageToUpdate.file
          ? { ...mediaItem, tag }
          : mediaItem
      );
      onChange({ media: updatedMedia });

      setTimeout(() => {
        validateField(`${category}-tag-${index}`, tag);
      }, 100);
    },
    [formData.media, imagesByCategory, onChange, validateField]
  );

  const handleDescriptionChange = useCallback(
    (category: string, index: number, description: string) => {
      if (!formData.media) return;

      const imageToUpdate = imagesByCategory[category]?.[index];
      if (!imageToUpdate) {
        console.error(
          `❌ No se encontró la imagen en ${category} con índice ${index}`
        );
        return;
      }

      const updatedMedia = formData.media.map((mediaItem) =>
        mediaItem.file === imageToUpdate.file
          ? { ...mediaItem, description }
          : mediaItem
      );

      onChange({ media: updatedMedia });

      setTimeout(() => {
        validateField(`${category}-description-${index}`, description);
      }, 100);
    },
    [formData.media, imagesByCategory, onChange, validateField]
  );

  const handleSubmit = useCallback(() => {
    if (validateFields()) {
      const mediaData: Media[] =
        formData.media?.map((mediaItem) => ({
          tag: mediaItem.tag || "",
          file: mediaItem.file,
          description: mediaItem.description || "",
          idType: mediaItem.idType || 0,
          type: mediaItem.type,
          category: mediaItem.category,
        })) || [];

      onSubmit(mediaData, validateFields);
      onNext();
    }
  }, [validateFields, formData.media, onSubmit, onNext]);

  return (
    <div className="container mx-auto w-full rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark space-y-3">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {formData.projectType?.id === 1
          ? "Subir Imágenes del Proyecto"
          : "Subir Imágenes de la Propiedad"}
      </h2>

      {imagesTypes.map((type) => (
        <ImageUploadSection
          key={type.name}
          imageType={type}
          category="imageType"
          expanded={expandedSections[type.name]}
          images={
            imagesByCategory[type.name]?.map((media) =>
              typeof media.file === "string"
                ? media.file
                : URL.createObjectURL(media.file)
            ) || []
          }
          tags={imagesByCategory[type.name]?.map((img) => img.tag) || []}
          descriptions={
            imagesByCategory[type.name]?.map((img) => img.description || "") ||
            []
          }
          error={errors[type.name] || null}
          errors={{ ...errors }}
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

      {formData.commonAreas && formData.commonAreas.length > 0 && (
        <h3 className="my-6 text-center text-xl font-bold text-premium-primary dark:text-premium-primaryLight">
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
          category="commonArea"
          expanded={expandedSections[area.name] || false}
          images={imagesByCategory[area.name]?.map((media) => media.file) || []}
          tags={imagesByCategory[area.name]?.map((media) => media.tag) || []}
          descriptions={
            imagesByCategory[area.name]?.map(
              (media) => media.description || ""
            ) || []
          }
          error={errors[area.name] || null}
          errors={{ ...errors }}
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

      <ModalAlert
        title="Advertencia"
        message={alertMessage}
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
}
