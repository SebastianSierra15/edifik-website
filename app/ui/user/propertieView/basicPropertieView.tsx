import clsx from "clsx";
import { ProjectData } from "@/lib/definitios";
import { ClientFormDisplay } from "@/src/components/shared";
import StepNavigationButtons from "../stepNavigationButtons";

interface BasicPropertieViewProps {
  project: ProjectData;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function BasicPropertieView({
  project,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: BasicPropertieViewProps) {
  return (
    <div className="container mx-auto w-full rounded-lg bg-client-background p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold text-client-accent">
        Datos Básicos
      </h2>

      <div className="space-y-6">
        <ClientFormDisplay
          label={`Nombre del ${project.propertyType?.id ? "Proyecto" : "Propiedad"}`}
          value={project.name || "No especificado"}
        />

        <div
          className={clsx(
            "grid grid-cols-1 gap-4",
            project.propertyType?.id && "sm:grid-cols-2"
          )}
        >
          <ClientFormDisplay
            label="Tipo de Propiedad"
            value={project.propertyType?.name || "No especificado"}
          />

          {project.projectType?.id && (
            <ClientFormDisplay
              label="Finalidad"
              value={project.projectType?.name || "No especificado"}
            />
          )}
        </div>

        <ClientFormDisplay
          label="Correo del Propietario"
          value={project?.email || "No especificado"}
        />

        <ClientFormDisplay
          label="Resumen breve"
          value={project.shortDescription || "No especificado"}
          rows={3}
        />

        <ClientFormDisplay
          label="Descripción Completa"
          value={project.detailedDescription || "No especificado"}
          rows={6}
        />

        <ClientFormDisplay
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
