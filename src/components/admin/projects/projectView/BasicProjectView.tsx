import clsx from "clsx";
import type { ProjectFormData } from "@/src/interfaces";
import { AdminFormDisplay } from "@/src/components/shared";
import { StepNavigationButtons } from "../StepNavigationButtons";

interface BasicProjectViewProps {
  project: ProjectFormData;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function BasicProjectView({
  project,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: BasicProjectViewProps) {
  return (
    <div className="container mx-auto w-full rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        Datos Básicos
      </h2>

      <div className="space-y-6">
        <AdminFormDisplay
          label={`Nombre del ${project.propertyType?.id === 1 ? "Proyecto" : "Propiedad"}`}
          value={project.name || "No especificado"}
        />

        <div
          className={clsx(
            "grid grid-cols-1 gap-4",
            project.propertyType?.id === 1 && "sm:grid-cols-2"
          )}
        >
          <AdminFormDisplay
            label="Tipo de Propiedad"
            value={project.propertyType?.name || "No especificado"}
          />

          {project.projectType?.id && (
            <AdminFormDisplay
              label="Finalidad"
              value={project.projectType?.name || "No especificado"}
            />
          )}
        </div>

        <AdminFormDisplay
          label="Correo del Propietario"
          value={project?.email || "No especificado"}
        />

        <AdminFormDisplay
          label="Resumen breve"
          value={project.shortDescription || "No especificado"}
          rows={3}
        />

        <AdminFormDisplay
          label="Descripción Completa"
          value={project.detailedDescription || "No especificado"}
          rows={6}
        />

        <AdminFormDisplay
          label="Propio de la empresa"
          value={project.membership === 1004 ? "Sí" : "No"}
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
