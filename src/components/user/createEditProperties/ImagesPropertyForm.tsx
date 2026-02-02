"use client";

import clsx from "clsx";
import { useState, ChangeEvent, useEffect, useCallback, useMemo } from "react";
import { ProjectFormData, ImageType, Media } from "@/src/interfaces";
import { useImagesProjectValidation } from "@/src/hooks/projects";
import { StepNavigationButtons } from "@/src/components/user";
import { ImageUploadSection } from "./ImageUploadSection";
import {
  ClientFormErrorMessage,
  ClientTooltipIcon,
  ModalAlert,
} from "@/src/components/shared";
import { getYouTubeEmbedUrl } from "@/utils";

interface ImagesPropertyFormProps {
  formData: ProjectFormData;
  onChange: (updatedData: Partial<ProjectFormData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  imagesTypes: ImageType[];
  onSubmit: (media: Media[], validateFields: () => boolean) => void;
}

export function ImagesPropertyForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  imagesTypes,
  onSubmit,
}: ImagesPropertyFormProps) {
  const [initialized, setInitialized] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage] = useState("");

  const { errors, validateFields, validateField, validateVideoUrl } =
    useImagesProjectValidation(formData, imagesTypes, true);

  const imagesByCategory = useMemo(() => {
    const grouped: Record<string, Media[]> = {};
    (formData.media || []).forEach((media) => {
      if (!media.type) return;
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
  }, [formData.projectMedia, initialized, onChange]);

  useEffect(() => {
    setExpandedSections(
      imagesTypes.reduce((acc, item) => ({ ...acc, [item.name]: false }), {}),
    );
  }, [imagesTypes]);

  useEffect(() => {
    if (!formData.media || formData.media.length === 0) return;
    setTimeout(() => {
      validateFields();
    }, 100);
  }, [formData.media, validateFields]);

  const toggleSection = useCallback((category: string) => {
    setExpandedSections((prev) => ({ ...prev, [category]: !prev[category] }));
  }, []);

  const handleImageChange = useCallback(
    (
      category: string,
      categoryId: number,
      isImageType: boolean,
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      if (!event.target.files || event.target.files.length === 0) return;

      const selectedFiles = Array.from(event.target.files);
      const categoryType: Media["category"] = isImageType
        ? "imageType"
        : "commonArea";

      const newMedia: Media[] = selectedFiles.map((file) => ({
        file,
        tag: "",
        description: "",
        idType: categoryId,
        type: category,
        category: categoryType,
      }));

      const updatedMedia = [...(formData.media || []), ...newMedia];

      onChange({ media: updatedMedia });
    },
    [onChange, formData.media],
  );

  const handleRemoveImage = useCallback(
    (category: string, index: number) => {
      const imageToRemove = imagesByCategory[category]?.[index];
      if (!imageToRemove) {
        console.error(`No se encontró la imagen en la categoría ${category}`);
        return;
      }

      const updatedMedia = (formData.media || []).filter(
        (media) => media.file !== imageToRemove.file,
      );

      onChange({ media: updatedMedia });
    },
    [onChange, formData.media, imagesByCategory],
  );


  const handleDescriptionChange = useCallback(
    (category: string, index: number, description: string) => {
      if (!formData.media) return;

      const imageToUpdate = imagesByCategory[category]?.[index];
      if (!imageToUpdate) {
        console.error(
          `No se encontró la imagen en ${category} con índice ${index}`,
        );
        return;
      }

      const updatedMedia = formData.media.map((mediaItem) =>
        mediaItem.file === imageToUpdate.file
          ? { ...mediaItem, description }
          : mediaItem,
      );

      onChange({ media: updatedMedia });

      setTimeout(() => {
        validateField(`${category}-description-${index}`, description);
      }, 100);
    },
    [formData.media, imagesByCategory, onChange, validateField],
  );

  const handleVideoUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const trimmed = value.trim();
      const nextValue = trimmed ? value : undefined;
      onChange({ videoUrl: nextValue });
      validateVideoUrl(nextValue);
    },
    [onChange, validateVideoUrl],
  );

  const videoEmbedUrl = useMemo(
    () => getYouTubeEmbedUrl(formData.videoUrl),
    [formData.videoUrl],
  );

  const handleSubmit = useCallback(() => {
    if (!validateFields()) return;

    const baseName = formData.name?.trim() || "Propiedad";
    const mediaData: Media[] =
      formData.media?.map((mediaItem, index) => ({
        tag: mediaItem.tag || `${baseName}-${index + 1}`,
        file: mediaItem.file,
        description: mediaItem.description || "",
        idType: mediaItem.idType || 0,
        type: mediaItem.type,
        category: mediaItem.category,
      })) || [];

    onSubmit(mediaData, validateFields);
    onNext();
  }, [validateFields, formData.media, formData.name, onSubmit, onNext]);

  return (
    <div className="container mx-auto w-full rounded-lg bg-client-background p-6 shadow-lg space-y-3">
      <h2 className="mb-6 text-center text-2xl font-bold text-client-accent">
        Subir Imágenes de la Propiedad
      </h2>

      {imagesTypes.map((type) => (
        <ImageUploadSection
          key={type.name}
          imageType={type}
          category="imageType"
          expanded={expandedSections[type.name]}
          images={
            imagesByCategory[type.name]?.map((media) =>
              media.file,
            ) || []
          }
          descriptions={
            imagesByCategory[type.name]?.map((img) => img.description || "") ||
            []
          }
          error={errors[type.name] || null}
          errors={{ ...errors }}
          onToggleExpand={() => toggleSection(type.name)}
          onImageChange={(e) => handleImageChange(type.name, type.id, true, e)}
          onRemoveImage={(index) => handleRemoveImage(type.name, index)}
          onDescriptionChange={(index, newDescription) =>
            handleDescriptionChange(type.name, index, newDescription)
          }
        />
      ))}

      <div
        className={clsx(
          "rounded-md pb-1 transition bg-client-backgroundLight hover:bg-client-backgroundAlt",
          formData.videoUrl && errors.videoUrl
            ? "border border-red-500"
            : "border-none",
        )}
      >
        <div className="p-4 space-y-4">
          <label className="mb-2 flex items-center gap-2 text-client-text">
            Video de YouTube
            <ClientTooltipIcon tooltipText="Puedes pegar una URL de YouTube o Shorts." />
          </label>

          <input
            type="text"
            name="videoUrl"
            value={formData.videoUrl ?? ""}
            placeholder="https://www.youtube.com/watch?v=..."
            onChange={handleVideoUrlChange}
            className="w-full rounded-lg bg-transparent px-3 py-2 text-client-text border border-gray-400 focus:outline-none"
          />

          {formData.videoUrl && errors.videoUrl && (
            <ClientFormErrorMessage error={errors.videoUrl} />
          )}

          {videoEmbedUrl && (
            <div className="mt-2 overflow-hidden rounded-md">
              <iframe
                src={videoEmbedUrl}
                title="Video de la propiedad"
                className="h-64 w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>

      {formData.commonAreas && formData.commonAreas.length > 0 && (
        <h3 className="my-6 text-center text-xl font-bold text-client-accent">
          Subir imágenes de las áreas comunes
        </h3>
      )}

      {formData.commonAreas?.map((area) => {
        if (!area.name) return null;
        const areaName = area.name;

        return (
          <ImageUploadSection
            key={areaName}
            imageType={{
              id: area.id,
              name: areaName,
              description: null,
              maxImagesAllowed: 5,
              isRequired: true,
            }}
            category="commonArea"
            expanded={expandedSections[areaName] || false}
            images={
              imagesByCategory[areaName]?.map((media) => media.file) || []
            }
            descriptions={
              imagesByCategory[areaName]?.map(
                (media) => media.description || "",
              ) || []
            }
            error={errors[areaName] || null}
            errors={{ ...errors }}
            onToggleExpand={() => toggleSection(areaName)}
            onImageChange={(e) =>
              handleImageChange(areaName, area.id, false, e)
            }
            onRemoveImage={(index) => handleRemoveImage(areaName, index)}
            onDescriptionChange={(index, newDescription) =>
              handleDescriptionChange(areaName, index, newDescription)
            }
          />
        );
      })}

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

