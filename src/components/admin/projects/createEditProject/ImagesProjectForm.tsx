"use client";

import type { ImageType, Media, ProjectFormData } from "@/src/interfaces";
import { useImagesProjectForm } from "@/src/hooks/projects";
import { useModalAlert } from "@/src/providers";
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
}: UploadImagesFormProps) {
  const { showModalAlert } = useModalAlert();
  const {
    errors,
    imagesByCategory,
    expandedSections,
    toggleSection,
    handleImageChange,
    handleRemoveImage,
    handleTagChange,
    handleDescriptionChange,
    handleSubmit,
  } = useImagesProjectForm({
    formData,
    imagesTypes,
    onChange,
    onSubmit,
    onNext,
    showModalAlert,
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
          onImageChange={(e) => handleImageChange(type.name, type.id, true, e)}
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
          tags={imagesByCategory[area.name]?.map((media) => media.tag) || []}
          descriptions={
            imagesByCategory[area.name]?.map(
              (media) => media.description || ""
            ) || []
          }
          error={errors[area.name] || null}
          errors={{ ...errors }}
          onToggleExpand={() => toggleSection(area.name)}
          onImageChange={(e) => handleImageChange(area.name, area.id, false, e)}
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
    </div>
  );
}
