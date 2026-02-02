"use client";

import clsx from "clsx";
import type { ImageType, Media, ProjectFormData } from "@/src/interfaces";
import { useImagesProjectForm } from "@/src/hooks/projects";
import { useModalAlert } from "@/src/providers";
import {
  AdminFormErrorMessage,
  AdminTooltipIcon,
} from "@/src/components/shared";
import { ImageUploadSection } from "./ImageUploadSection";
import { StepNavigationButtons } from "../StepNavigationButtons";

interface UploadImagesFormProps {
  formData: ProjectFormData;
  onChange: (updatedData: Partial<ProjectFormData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  imagesTypes: ImageType[];
  onSubmit: (media: Media[], validateFields: () => boolean) => void;
  isProperty: boolean;
}

export function ImagesProjectForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  imagesTypes,
  onSubmit,
  isProperty,
}: UploadImagesFormProps) {
  const { showModalAlert } = useModalAlert();
  const {
    errors,
    imagesByCategory,
    expandedSections,
    toggleSection,
    handleImageChange,
    handleRemoveImage,
    handleDescriptionChange,
    handleVideoUrlChange,
    videoEmbedUrl,
    handleSubmit,
  } = useImagesProjectForm({
    formData,
    imagesTypes,
    onChange,
    onSubmit,
    onNext,
    showModalAlert,
    isProperty,
  });

  return (
    <div className="container mx-auto w-full rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark space-y-3">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {formData.projectType?.id === 1
          ? "Subir Imagenes del Proyecto"
          : "Subir Imagenes de la Propiedad"}
      </h2>

      {imagesTypes.map((type) => (
        <ImageUploadSection
          key={type.name}
          imageType={type}
          category="imageType"
          expanded={expandedSections[type.name]}
          images={imagesByCategory[type.name]?.map((media) => media.file) || []}
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
          "rounded-md pb-1 transition bg-premium-backgroundDark hover:bg-premium-background dark:bg-premium-background dark:hover:bg-premium-backgroundLight",
          formData.videoUrl && errors.videoUrl
            ? "border border-red-500"
            : "border-none",
        )}
      >
        <div className="p-4 space-y-4">
          <label className="mb-2 flex items-center gap-2 xt-lg font-semibold text-premium-textPrimary">
            Video de YouTube
            <AdminTooltipIcon tooltipText="Puedes pegar una URL de YouTube o Shorts en donde se visualice la propiedad." />
          </label>

          <input
            type="text"
            name="videoUrl"
            value={formData.videoUrl ?? ""}
            placeholder="https://www.youtube.com/watch?v=..."
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            className="w-full rounded-lg bg-transparent px-3 py-2 text-gray-600 dark:text-gray-400 focus:outline-none border border-gray-400 dark:border-gray-400"
          />

          {formData.videoUrl && errors.videoUrl && (
            <AdminFormErrorMessage error={errors.videoUrl} />
          )}

          {videoEmbedUrl && (
            <div className="mt-2 overflow-hidden rounded-md">
              <iframe
                src={videoEmbedUrl}
                title="Video del proyecto"
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
        <h3 className="my-6 text-center text-xl font-bold text-premium-primary dark:text-premium-primaryLight">
          Subir imagenes de las areas comunes
        </h3>
      )}

      {formData.commonAreas?.map((area) => (
        <ImageUploadSection
          key={area.name}
          imageType={{
            id: area.id,
            name: area.name,
            description: null,
            maxImagesAllowed: 5,
            isRequired: true,
          }}
          category="commonArea"
          expanded={expandedSections[area.name] || false}
          images={imagesByCategory[area.name]?.map((media) => media.file) || []}
          descriptions={
            imagesByCategory[area.name]?.map(
              (media) => media.description || "",
            ) || []
          }
          error={errors[area.name] || null}
          errors={{ ...errors }}
          onToggleExpand={() => toggleSection(area.name)}
          onImageChange={(e) => handleImageChange(area.name, area.id, false, e)}
          onRemoveImage={(index) => handleRemoveImage(area.name, index)}
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
    </div>
  );
}
