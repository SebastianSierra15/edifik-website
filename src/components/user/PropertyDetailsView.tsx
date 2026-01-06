"use client";

import { useMemo } from "react";
import { ProjectDetails, SimpleCatalog } from "@/src/interfaces";
import { formatNumber } from "@/utils/formatters";
import { ClientFormDisplay } from "@/src/components/shared";
import { StepNavigationButtons } from "./StepNavigationButtons";

interface PropertyDetailsViewProps {
  project: Partial<ProjectDetails>;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function PropertyDetailsView({
  project,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: PropertyDetailsViewProps) {
  const shouldShowField = useMemo(() => {
    const propertyTypeId = project.propertyType?.id;

    return {
      price: project.projectType?.id === 2 || project.projectType?.id === 3,
      availableUnits:
        project.projectType?.id === 2 || project.projectType?.id === 3,
      housingType: propertyTypeId === 1001 || propertyTypeId === 1002,
      complexName:
        propertyTypeId === 1002 &&
        (project.projectType?.id === 2 || project.projectType?.id === 3),
      availableDate: true,
      commonAreas: project.commonAreas && project.commonAreas.length > 0,
      nearbyServices:
        project.nearbyServices && project.nearbyServices.length > 0,
    };
  }, [project]);

  return (
    <div className="container mx-auto w-full rounded-lg bg-client-background p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold text-client-accent">
        {project.projectType?.id === 1
          ? "Detalles del Proyecto"
          : "Detalles de la Propiedad"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shouldShowField.price && (
          <ClientFormDisplay
            label="Precio"
            value={formatNumber(project.price ?? 0)}
          />
        )}

        {shouldShowField.availableUnits && (
          <ClientFormDisplay
            label="Unidades Disponibles"
            value={String(project.availableUnits ?? "No especificado")}
          />
        )}

        {shouldShowField.housingType && (
          <ClientFormDisplay
            label="Tipo de Vivienda"
            value={project.housingType?.name ?? "No especificado"}
          />
        )}

        {shouldShowField.availableDate && (
          <ClientFormDisplay
            label="Fecha Estimada de Entrega"
            value={
              project.availableDate
                ? new Date(project.availableDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                  })
                : "No especificado"
            }
          />
        )}

        {shouldShowField.complexName && (
          <ClientFormDisplay
            label="Nombre del Conjunto"
            value={project.complexName ?? "No especificado"}
          />
        )}

        {shouldShowField.commonAreas && (
          <DetailList label="Áreas Comunes" items={project.commonAreas} />
        )}

        {shouldShowField.nearbyServices && (
          <DetailList
            label="Servicios Cercanos"
            items={project.nearbyServices}
          />
        )}
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

interface DetailListProps {
  label: string;
  items?: SimpleCatalog[];
}

function DetailList({ label, items }: DetailListProps) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-lg font-bold text-client-accent">{label}</h3>

      <ul className="grid grid-cols-1 gap-2 text-premium-textPrimary dark:text-premium-textSecondary">
        {items.map((item) => (
          <li key={item.id} className="pl-4 before:content-['•'] before:mr-2">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
