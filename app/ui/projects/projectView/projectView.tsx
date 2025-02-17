"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProjectData } from "@/lib/definitios";
import useLocations from "@/app/hooks/projects/Metadata/location/useLocations";
import useBasicMetadata from "@/app/hooks/projects/Metadata/useBasicMetadata";
import useImageTypes from "@/app/hooks/projects/Metadata/imageTypes/useImageTypes";
import { useProjectById } from "@/app/hooks/projects/useProjectById";
import ProgressBar from "@/app/ui/projects/createEditProject/progressBar";
import BasicProjectView from "./basicProjectView";
import LocationProjectView from "./locationProjectView";
import FeaturesProjectView from "./featuresProjectView";
import DetailsProjectView from "./detailsProjectView";
import ImagesProjectView from "./imagesProjectView";
import CreateProjectSkeleton from "@/app/ui/skeletons/createProjectSkeleton";

interface ProjectViewProps {
  projectId: number;
  isProperty: boolean;
}

export default function ProjectView({
  projectId,
  isProperty,
}: ProjectViewProps) {
  const { project, loading: loadingProject } = useProjectById(projectId);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const router = useRouter();

  const { locations } = useLocations();
  const { metadata } = useBasicMetadata();
  const { imagesTypes, loadingImages } = useImageTypes();

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const projectData: Partial<ProjectData> = project ?? {};

  const currentView = useMemo(() => {
    if (!metadata || !locations || loadingProject || loadingImages) {
      return <CreateProjectSkeleton />;
    }

    return (
      <>
        {currentStep === 0 && (
          <BasicProjectView
            project={projectData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 1 && (
          <LocationProjectView
            project={projectData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 2 && (
          <FeaturesProjectView
            project={projectData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 3 && (
          <DetailsProjectView
            project={projectData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 4 && (
          <ImagesProjectView
            project={projectData}
            imagesTypes={imagesTypes}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
      </>
    );
  }, [currentStep, metadata, locations, project, imagesTypes, loadingImages]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-10 mt-24 text-center text-3xl font-semibold text-premium-primary lg:mt-20 dark:text-premium-primaryLight">
        Visualizar {isProperty ? "Propiedad" : "Proyecto"}
      </h1>

      <div className="mx-auto mb-10 text-center">
        <ProgressBar currentStep={currentStep} />
      </div>

      <div className="mt-6 mx-auto max-w-3xl">{currentView}</div>

      <div className="mt-4 text-center">
        <button
          className="rounded-md bg-premium-secondary px-4 py-2 text-white transition-colors hover:bg-premium-secondaryLight dark:bg-premium-secondaryDark dark:hover:bg-premium-secondaryLight"
          onClick={() => router.push("/admin/solicitudes")}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
