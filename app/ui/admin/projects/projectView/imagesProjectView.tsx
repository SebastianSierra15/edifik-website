import { ProjectData, ImageType } from "@/lib/definitios";
import ProjectMediaGallery from "./projectMediaGallery";
import StepNavigationButtons from "../../stepNavigationButtons";

interface ImagesProjectViewProps {
  project: ProjectData;
  imagesTypes: ImageType[];
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function ImagesProjectView({
  project,
  imagesTypes,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: ImagesProjectViewProps) {
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
