"use client";

import { ProjectDetails } from "@/src/interfaces";
import { LocationMapSection } from "@/src/components/admin";
import { ClientFormDisplay } from "@/src/components/shared";
import { StepNavigationButtons } from "./StepNavigationButtons";

interface PropertyLocationViewProps {
  project: Partial<ProjectDetails>;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function PropertyLocationView({
  project,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: PropertyLocationViewProps) {
  const coordinates = {
    lat: project.latitude || 4.5709,
    lng: project.longitude || -74.2973,
  };

  return (
    <div className="container mx-auto w-full rounded-lg bg-client-background p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold text-client-accent">
        {project.projectType?.id
          ? "Ubicación del Proyecto"
          : "Ubicación de la Propiedad"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <ClientFormDisplay
          label="Departamento"
          value={project.city?.departament?.name || "No especificado"}
        />
        <ClientFormDisplay
          label="Ciudad"
          value={project.city?.name || "No especificado"}
        />
      </div>

      <ClientFormDisplay
        label="Dirección"
        value={project.address || "No especificado"}
      />

      <div className="relative mt-6">
        <LocationMapSection
          mapAddress={project.address || ""}
          isMapsReady={true}
          onMapAddressChange={() => {}}
          onAddressSelect={() => {}}
          onLocationSelect={() => {}}
          coordinates={coordinates}
          label="Dirección"
          tooltipText=""
          showSearch={false}
          showUserLocationButton={false}
        />
      </div>

      <StepNavigationButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
}
