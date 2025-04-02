import { useMemo } from "react";
import { ProjectData } from "@/lib/definitios";
import LocationMap from "../locationMap";
import StepNavigationButtons from "../../stepNavigationButtons";
import FormDisplay from "@/app/ui/modals/admin/formDisplay";

interface LocationProjectViewProps {
  project: ProjectData;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function LocationProjectView({
  project,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: LocationProjectViewProps) {
  const isMapsReady = typeof window !== "undefined" && !!window.google?.maps;

  return (
    <div className="container mx-auto w-full rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {project.projectType?.id
          ? "Ubicación del Proyecto"
          : "Ubicación de la Propiedad"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <FormDisplay
          label="Departamento"
          value={project.city?.departament?.name || "No especificado"}
        />
        <FormDisplay
          label="Ciudad"
          value={project.city?.name || "No especificado"}
        />
      </div>

      <FormDisplay
        label="Dirección"
        value={project.address || "No especificado"}
      />

      <div className="relative mt-6 h-64 w-full">
        <LocationMap
          isLoaded={isMapsReady}
          coordinates={{
            lat: project.latitude || 4.5709,
            lng: project.longitude || -74.2973,
          }}
          onLocationSelect={() => {}}
          onUpdateAddress={undefined}
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
