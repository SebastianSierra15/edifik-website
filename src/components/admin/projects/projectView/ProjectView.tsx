"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ProjectFormData } from "@/src/interfaces";
import {
  useLocations,
  useBasicMetadata,
  useImageTypes,
  useProjectById,
} from "@/src/hooks/projects";
import { ProgressBar } from "../createEditProject/ProgressBar";
import { BasicProjectView } from "./BasicProjectView";
import { LocationProjectView } from "./LocationProjectView";
import { FeaturesProjectView } from "./FeaturesProjectView";
import { DetailsProjectView } from "./DetailsProjectView";
import { ImagesProjectView } from "./ImagesProjectView";
import { CreateProjectSkeleton } from "../createEditProject";

interface ProjectViewProps {
  projectId: number;
  isProperty: boolean;
}

export function ProjectView({ projectId, isProperty }: ProjectViewProps) {
  const { project, loading: loadingProject } = useProjectById(
    projectId,
    !isProperty,
    true
  );
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const router = useRouter();

  const { locations } = useLocations();
  const { metadata } = useBasicMetadata();
  const { imagesTypes, loadingImages } = useImageTypes();

  const projectData = useMemo<ProjectFormData>(() => project ?? {}, [project]);

  const handleNextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  }, [currentStep, totalSteps]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  }, [currentStep]);

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
  }, [
    currentStep,
    metadata,
    locations,
    projectData,
    imagesTypes,
    loadingImages,
    loadingProject,
    handleNextStep,
    handlePreviousStep,
  ]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-10 text-center text-3xl font-semibold text-premium-primary dark:text-premium-primaryLight">
        Visualizar{" "}
        {projectData.projectType?.id === 1 ? "Proyecto" : "Propiedad"}
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
