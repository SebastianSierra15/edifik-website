"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProjectData } from "@/lib/definitios";
import useLocations from "@/app/hooks/projects/metadata/location/useLocations";
import useBasicMetadata from "@/app/hooks/projects/metadata/useBasicMetadata";
import useImageTypes from "@/app/hooks/projects/metadata/imageTypes/useImageTypes";
import { useProjectById } from "@/app/hooks/projects/useProjectById";
import ProgressBar from "../createEditProperties/progressBar";
import BasicPropertieView from "./basicPropertieView";
import LocationPropertieView from "./locationPropertieView";
import FeaturesPropertieView from "./featuresPropertieView";
import DetailsPropertieView from "./detailsPropertieView";
import ImagesPropertieView from "./imagesPropertieView";
import { CreateProjectSkeleton } from "@/src/components/admin";

interface PropertieViewProps {
  projectId: number;
}

export default function PropertieView({ projectId }: PropertieViewProps) {
  const { project, loading: loadingProject } = useProjectById(
    projectId,
    false,
    true
  );

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
          <BasicPropertieView
            project={projectData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 1 && (
          <LocationPropertieView
            project={projectData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 2 && (
          <FeaturesPropertieView
            project={projectData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 3 && (
          <DetailsPropertieView
            project={projectData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 4 && (
          <ImagesPropertieView
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
