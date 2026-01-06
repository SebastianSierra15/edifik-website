import { useMemo } from "react";
import type { ProjectFormData } from "@/src/interfaces";
import { AdminFormDisplay } from "@/src/components/shared";
import { StepNavigationButtons } from "../StepNavigationButtons";

interface FeaturesProjectViewProps {
  project: ProjectFormData;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function FeaturesProjectView({
  project,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: FeaturesProjectViewProps) {
  const shouldShowField = useMemo(() => {
    const propertyTypeId = project.propertyType?.id;

    return {
      socioeconomicLevel: propertyTypeId === 1001 || propertyTypeId === 1002,
      yearBuilt: propertyTypeId === 1001 || propertyTypeId === 1002,
      bedrooms: propertyTypeId === 1001 || propertyTypeId === 1002,
      storageUnits: propertyTypeId === 1001 || propertyTypeId === 1002,
      balcony: propertyTypeId === 1001 || propertyTypeId === 1002,
      laundryArea: propertyTypeId === 1001 || propertyTypeId === 1002,
      customizationOptions: propertyTypeId === 1001 || propertyTypeId === 1002,
      terrace: propertyTypeId === 1001,
      garden: propertyTypeId === 1001,
      bathrooms:
        propertyTypeId === 1001 ||
        propertyTypeId === 1002 ||
        propertyTypeId === 1004,
      lobbies:
        propertyTypeId === 1001 ||
        propertyTypeId === 1002 ||
        propertyTypeId === 1004,
      elevator: propertyTypeId === 1001 || propertyTypeId === 1002,
      towers: propertyTypeId === 1002,
      floorNumber: propertyTypeId === 1002,
      freeHeight:
        propertyTypeId === 1004 ||
        propertyTypeId === 1003 ||
        propertyTypeId === 1005,
      width:
        propertyTypeId === 1005 ||
        propertyTypeId === 1006 ||
        propertyTypeId === 1007,
      length:
        propertyTypeId === 1005 ||
        propertyTypeId === 1006 ||
        propertyTypeId === 1007,
      heavyParking: propertyTypeId === 1005,
    };
  }, [project.propertyType?.id]);

  return (
    <div className="container mx-auto w-full rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {project.projectType?.id === 1
          ? "Características del Proyecto"
          : "Características de la Propiedad"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AdminFormDisplay
          label="Área Total (m²)"
          value={String(project.totalArea ?? "No especificado")}
        />
        <AdminFormDisplay
          label="Área Construida (m²)"
          value={String(project.builtArea ?? "No especificado")}
        />
        {shouldShowField.socioeconomicLevel && (
          <AdminFormDisplay
            label="Nivel Socioeconómico"
            value={String(project.socioeconomicLevel ?? "No especificado")}
          />
        )}
        {shouldShowField.yearBuilt && (
          <AdminFormDisplay
            label="Año de Construcción"
            value={String(project.yearBuilt ?? "No especificado")}
          />
        )}
        {shouldShowField.bedrooms && (
          <AdminFormDisplay
            label="Número de Habitaciones"
            value={String(project.bedrooms ?? "No especificado")}
          />
        )}
        {shouldShowField.bathrooms && (
          <AdminFormDisplay
            label="Número de Baños"
            value={String(project.bathrooms ?? "No especificado")}
          />
        )}
        {shouldShowField.lobbies && (
          <AdminFormDisplay
            label="Número de Salas de Estar"
            value={String(project.lobbies ?? "No especificado")}
          />
        )}
        {shouldShowField.freeHeight && (
          <AdminFormDisplay
            label="Altura Libre (m)"
            value={String(project.freeHeight ?? "No especificado")}
          />
        )}
        {shouldShowField.width && (
          <AdminFormDisplay
            label="Frente (m)"
            value={String(project.width ?? "No especificado")}
          />
        )}
        {shouldShowField.length && (
          <AdminFormDisplay
            label="Fondo (m)"
            value={String(project.length ?? "No especificado")}
          />
        )}
        {shouldShowField.heavyParking && (
          <AdminFormDisplay
            label="Espacios de Parqueo Pesado"
            value={String(project.heavyParking ?? "No especificado")}
          />
        )}
        {shouldShowField.towers && (
          <AdminFormDisplay
            label="Número de Torres"
            value={String(project.towers ?? "No especificado")}
          />
        )}
        {shouldShowField.floorNumber && (
          <AdminFormDisplay
            label="Número de Piso"
            value={String(project.floorNumber ?? "No especificado")}
          />
        )}
        {shouldShowField.storageUnits && (
          <AdminFormDisplay
            label="Número de Depósitos"
            value={String(project.storageUnits ?? "No especificado")}
          />
        )}
        <AdminFormDisplay
          label="Espacios de Parqueo"
          value={String(project.parkingSpots ?? "No especificado")}
        />
      </div>

      {(project.propertyType?.id === 1001 ||
        project.propertyType?.id === 1002) && (
        <div>
          <h3 className="my-4 text-center text-lg font-semibold text-premium-primary dark:text-premium-primaryLight">
            Características Adicionales
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {shouldShowField.elevator && (
              <AdminFormDisplay
                label="Elevador"
                value={project.elevator ? "Sí" : "No"}
              />
            )}
            {shouldShowField.terrace && (
              <AdminFormDisplay
                label="Terraza"
                value={project.terrace ? "Sí" : "No"}
              />
            )}
            {shouldShowField.balcony && (
              <AdminFormDisplay
                label="Balcón"
                value={project.balcony ? "Sí" : "No"}
              />
            )}
            {shouldShowField.garden && (
              <AdminFormDisplay
                label="Jardín"
                value={project.garden ? "Sí" : "No"}
              />
            )}
            {shouldShowField.laundryArea && (
              <AdminFormDisplay
                label="Área de Lavado"
                value={project.laundryArea ? "Sí" : "No"}
              />
            )}
            {shouldShowField.customizationOptions && (
              <AdminFormDisplay
                label="Opciones de Personalización"
                value={project.customizationOptions ? "Sí" : "No"}
              />
            )}
          </div>
        </div>
      )}

      <StepNavigationButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
}
