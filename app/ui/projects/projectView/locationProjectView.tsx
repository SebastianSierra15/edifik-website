import { useMemo } from "react";
import { ProjectData } from "@/lib/definitios";
import { useLoadScript } from "@react-google-maps/api";
import LocationMap from "../locationMap";
import StepNavigationButtons from "../../admin/stepNavigationButtons";
import FormDisplay from "@/app/ui/modals/formDisplay";

const GOOGLE_MAPS_LIBRARIES: ("places" | "marker")[] = ["places", "marker"];

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
  const mapsApiKey = useMemo(
    () => process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapsApiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

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
          isLoaded={isLoaded}
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
