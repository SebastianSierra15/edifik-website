"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProjectDetails } from "@/src/interfaces";
import {
  useProjectById,
  useLocations,
  useBasicMetadata,
  useImageTypes,
} from "@/src/hooks/projects";
import { CreateProjectSkeleton } from "@/src/components/admin";
import { ProgressBar } from "./ProgressBar";
import { PropertyBasicView } from "./PropertyBasicView";
import { PropertyLocationView } from "./PropertyLocationView";
import { PropertyFeaturesView } from "./PropertyFeaturesView";
import { PropertyDetailsView } from "./PropertyDetailsView";
import { PropertyImagesView } from "./PropertyImagesView";

interface PropertyViewProps {
  projectId: number;
}

export function PropertyView({ projectId }: PropertyViewProps) {
  const {
    project,
    loading: loadingProject,
    error,
  } = useProjectById(projectId, false, true);

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const router = useRouter();

  const { locations } = useLocations();
  const { metadata } = useBasicMetadata();
  const { imagesTypes, loadingImages } = useImageTypes();

  useEffect(() => {
    if (!error) return;
    if (error === "No autorizado" || error === "No autenticado") {
      router.replace("/unauthorized");
    }
  }, [error, router]);

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

  const projectData = useMemo(
    () => project ?? {},
    [project]
  ) as Partial<ProjectDetails>;

  const currentView = useMemo(() => {
    if (!metadata || !locations || loadingProject || loadingImages) {
      return <CreateProjectSkeleton />;
    }

    return (
      <>
        {currentStep === 0 && (
          <PropertyBasicView
            project={projectData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 1 && (
          <PropertyLocationView
            project={projectData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 2 && (
          <PropertyFeaturesView
            project={projectData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 3 && (
          <PropertyDetailsView
            project={projectData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 4 && (
          <PropertyImagesView
            project={projectData as ProjectDetails}
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
    handlePreviousStep,
    handleNextStep,
    metadata,
    locations,
    loadingProject,
    loadingImages,
    imagesTypes,
    projectData,
  ]);

  return (
    <div className="bg-client-backgroundLight w-full p-6">
      <h1 className="mb-10 mt-24 text-center text-3xl font-semibold text-client-text">
        Visualizar Propiedad
      </h1>

      <div className="mx-auto mb-10 text-center">
        <ProgressBar currentStep={currentStep} />
      </div>

      <div className="mt-6 mx-auto max-w-3xl">{currentView}</div>

      <div className="mt-4 text-center">
        <button
          className="rounded-md bg-client-background px-4 py-2 text-white transition-colors hover:bg-client-backgroundAlt"
          onClick={() => router.push("/usuario/mis-propiedades")}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
