import { useMemo } from "react";
import { ProjectData } from "@/lib/definitios";
import { ClientFormDisplay } from "@/src/components/shared";
import StepNavigationButtons from "../stepNavigationButtons";

interface FeaturesPropertieViewProps {
  project: ProjectData;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function FeaturesPropertieView({
  project,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: FeaturesPropertieViewProps) {
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
    <div className="container mx-auto w-full rounded-lg bg-client-background p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold text-client-accent">
        {project.projectType?.id === 1
          ? "Características del Proyecto"
          : "Características de la Propiedad"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ClientFormDisplay
          label="Área Total (m²)"
          value={String(project.totalArea ?? "No especificado")}
        />
        <ClientFormDisplay
          label="Área Construida (m²)"
          value={String(project.builtArea ?? "No especificado")}
        />
        {shouldShowField.socioeconomicLevel && (
          <ClientFormDisplay
            label="Nivel Socioeconómico"
            value={String(project.socioeconomicLevel ?? "No especificado")}
          />
        )}
        {shouldShowField.yearBuilt && (
          <ClientFormDisplay
            label="Año de Construcción"
            value={String(project.yearBuilt ?? "No especificado")}
          />
        )}
        {shouldShowField.bedrooms && (
          <ClientFormDisplay
            label="Número de Habitaciones"
            value={String(project.bedrooms ?? "No especificado")}
          />
        )}
        {shouldShowField.bathrooms && (
          <ClientFormDisplay
            label="Número de Baños"
            value={String(project.bathrooms ?? "No especificado")}
          />
        )}
        {shouldShowField.lobbies && (
          <ClientFormDisplay
            label="Número de Salas de Estar"
            value={String(project.lobbies ?? "No especificado")}
          />
        )}
        {shouldShowField.freeHeight && (
          <ClientFormDisplay
            label="Altura Libre (m)"
            value={String(project.freeHeight ?? "No especificado")}
          />
        )}
        {shouldShowField.width && (
          <ClientFormDisplay
            label="Frente (m)"
            value={String(project.width ?? "No especificado")}
          />
        )}
        {shouldShowField.length && (
          <ClientFormDisplay
            label="Fondo (m)"
            value={String(project.length ?? "No especificado")}
          />
        )}
        {shouldShowField.heavyParking && (
          <ClientFormDisplay
            label="Espacios de Parqueo Pesado"
            value={String(project.heavyParking ?? "No especificado")}
          />
        )}
        {shouldShowField.towers && (
          <ClientFormDisplay
            label="Número de Torres"
            value={String(project.towers ?? "No especificado")}
          />
        )}
        {shouldShowField.floorNumber && (
          <ClientFormDisplay
            label="Número de Piso"
            value={String(project.floorNumber ?? "No especificado")}
          />
        )}
        {shouldShowField.storageUnits && (
          <ClientFormDisplay
            label="Número de Depósitos"
            value={String(project.storageUnits ?? "No especificado")}
          />
        )}
        <ClientFormDisplay
          label="Espacios de Parqueo"
          value={String(project.parkingSpots ?? "No especificado")}
        />
      </div>

      {(project.propertyType?.id === 1001 ||
        project.propertyType?.id === 1002) && (
        <div>
          <h3 className="my-4 text-center text-lg font-semibold text-client-accent">
            Características Adicionales
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {shouldShowField.elevator && (
              <ClientFormDisplay
                label="Elevador"
                value={project.elevator ? "Sí" : "No"}
              />
            )}
            {shouldShowField.terrace && (
              <ClientFormDisplay
                label="Terraza"
                value={project.terrace ? "Sí" : "No"}
              />
            )}
            {shouldShowField.balcony && (
              <ClientFormDisplay
                label="Balcón"
                value={project.balcony ? "Sí" : "No"}
              />
            )}
            {shouldShowField.garden && (
              <ClientFormDisplay
                label="Jardín"
                value={project.garden ? "Sí" : "No"}
              />
            )}
            {shouldShowField.laundryArea && (
              <ClientFormDisplay
                label="Área de Lavado"
                value={project.laundryArea ? "Sí" : "No"}
              />
            )}
            {shouldShowField.customizationOptions && (
              <ClientFormDisplay
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
