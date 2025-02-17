import clsx from "clsx";
import { ProjectData } from "@/lib/definitios";
import FormDisplay from "@/app/ui/modals/formDisplay";
import StepNavigationButtons from "../../admin/stepNavigationButtons";

interface BasicProjectViewProps {
  project: ProjectData;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function BasicProjectView({
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
        <FormDisplay
          label={`Nombre del ${project.propertyType?.id ? "Proyecto" : "Propiedad"}`}
          value={project.name || "No especificado"}
        />

        <div
          className={clsx(
            "grid grid-cols-1 gap-4",
            project.propertyType?.id && "sm:grid-cols-2"
          )}
        >
          <FormDisplay
            label="Tipo de Propiedad"
            value={project.propertyType?.name || "No especificado"}
          />

          {project.projectType?.id && (
            <FormDisplay
              label="Finalidad"
              value={project.projectType?.name || "No especificado"}
            />
          )}
        </div>

        <FormDisplay
          label="Correo del Propietario"
          value={project?.email || "No especificado"}
        />

        <FormDisplay
          label="Resumen breve"
          value={project.shortDescription || "No especificado"}
          rows={3}
        />

        <FormDisplay
          label="Descripción Completa"
          value={project.detailedDescription || "No especificado"}
          rows={6}
        />

        <FormDisplay
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
