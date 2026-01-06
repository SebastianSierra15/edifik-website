"use client";

import { ProjectDetails, ImageType } from "@/src/interfaces";
import { PropertyMediaGallery } from "./PropertyMediaGallery";
import { StepNavigationButtons } from "./StepNavigationButtons";

interface PropertyImagesViewProps {
  project: ProjectDetails;
  imagesTypes: ImageType[];
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function PropertyImagesView({
  project,
  imagesTypes,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: PropertyImagesViewProps) {
  return (
    <div className="container mx-auto w-full rounded-lg bg-client-background p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold text-client-accent">
        {project.projectType?.id === 1
          ? "Imágenes del Proyecto"
          : "Imágenes de la Propiedad"}
      </h2>

      <PropertyMediaGallery
        images={project.projectMedia || []}
        imageTypes={imagesTypes}
        commonAreas={project.commonAreas || []}
      />

      <StepNavigationButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={onPrevious}
        onNext={onNext}
        hideConfirmation={true}
      />
    </div>
  );
}
