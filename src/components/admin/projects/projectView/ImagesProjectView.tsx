import type { ImageType, ProjectFormData } from "@/src/interfaces";
import { getYouTubeEmbedUrl } from "@/utils";
import { ProjectMediaGallery } from "./ProjectMediaGallery";
import { StepNavigationButtons } from "../StepNavigationButtons";

interface ImagesProjectViewProps {
  project: ProjectFormData;
  imagesTypes: ImageType[];
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function ImagesProjectView({
  project,
  imagesTypes,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: ImagesProjectViewProps) {
  const videoEmbedUrl = getYouTubeEmbedUrl(project.videoUrl);

  return (
    <div className="container mx-auto w-full rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {project.projectType?.id === 1
          ? "Imágenes del Proyecto"
          : "Imágenes de la Propiedad"}
      </h2>

      <ProjectMediaGallery
        images={project.projectMedia || []}
        imageTypes={imagesTypes}
        commonAreas={project.commonAreas || []}
      />

      {videoEmbedUrl && (
        <div className="mt-6">
          <h3 className="mb-4 text-center text-xl font-bold text-premium-primary dark:text-premium-primaryLight">
            {project.projectType?.id === 1
              ? "Video del Proyecto"
              : "Video de la Propiedad"}
          </h3>
          <div className="overflow-hidden rounded-md">
            <iframe
              src={videoEmbedUrl}
              title="Video del proyecto"
              className="h-64 w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}

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
