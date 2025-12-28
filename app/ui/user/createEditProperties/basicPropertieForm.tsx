import { useCallback, useMemo } from "react";
import { propertyType, ProjectData } from "@/lib/definitios";
import { useBasicProjectValidation } from "@/app/hooks/projects/createEditProject/useBasicProjectValidation";
import StepNavigationButtons from "@/app/ui/user/stepNavigationButtons";
import { ClientFormSelect, ClientFormTextArea } from "@/src/components/shared";

interface BasicPropertieFormProps {
  formData: ProjectData;
  onChange: (updatedData: Partial<ProjectData>) => void;
  onSubmit: (data: Partial<ProjectData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  propertyTypes: propertyType[];
  currentStep: number;
  totalSteps: number;
  isEdit: boolean;
  hasPermission?: boolean;
}

export default function BasicPropertieForm({
  formData,
  onChange,
  propertyTypes,
  onPrevious,
  currentStep,
  totalSteps,
  isEdit,
  onNext,
}: BasicPropertieFormProps) {
  const { errors, validateFields, validateField } = useBasicProjectValidation(
    formData,
    true,
    isEdit
  );

  const propertyOptions = useMemo(
    () => propertyTypes.map((type) => ({ id: type.id, name: type.name })),
    [propertyTypes]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (formData[name as keyof ProjectData] !== value) {
        onChange({ [name]: value });
        validateField(`${name}Error` as keyof typeof errors, value);
      }
    },
    [onChange, validateField, formData]
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      const selectedId = parseInt(value, 10);

      if (name === "propertyType") {
        const selectedPropertyType = propertyTypes.find(
          (type) => type.id === selectedId
        );
        if (selectedPropertyType) {
          onChange({ propertyType: selectedPropertyType });
          validateField("propertyTypeError", selectedPropertyType);
        }
      }

      if (name === "projectType") {
        onChange({
          projectType: {
            id: selectedId,
            name: selectedId === 2 ? "Venta" : "Arriendo",
          },
        });
        validateField("projectTypeError", { id: selectedId });
      }
    },
    [onChange, propertyTypes, validateField]
  );

  const handleNext = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      const isValid = await validateFields();
      if (!isValid) return;

      onNext();
    },
    [validateFields, onNext, formData, onChange, validateField]
  );

  const tooltipTexts = useMemo(
    () => ({
      name: "Nombre de la propiedad que se mostrará al público.",
      propertyType: "Seleccione el tipo de propiedad que más se ajuste.",
      projectType:
        "Seleccione si la propiedad va a estar en venta o en arriendo.",
      shortDescription:
        "Escriba un resumen breve que describa las principales características de la propiedad.",
      detailedDescription:
        "Incluya una descripción detallada que explique las características principales de la propiedad.",
    }),
    []
  );

  return (
    <div className="container mx-auto w-full rounded-lg bg-client-background p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold text-client-accent">
        Datos Básicos
      </h2>

      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ClientFormSelect
            label="Tipo de propiedad"
            name="propertyType"
            value={formData.propertyType?.id || ""}
            options={propertyOptions}
            onChange={handleSelectChange}
            error={errors.propertyTypeError}
            tooltipText={tooltipTexts.propertyType}
            isAccent={true}
          />

          <ClientFormSelect
            label="Finalidad de la propiedad"
            name="projectType"
            value={formData.projectType?.id || ""}
            options={[
              { id: 2, name: "Venta" },
              { id: 3, name: "Arriendo" },
            ]}
            onChange={handleSelectChange}
            error={errors.projectTypeError}
            tooltipText={tooltipTexts.projectType}
            isAccent={true}
          />
        </div>

        <ClientFormTextArea
          label="Resumen breve"
          name="shortDescription"
          value={formData.shortDescription || ""}
          placeholder="Agregue un resumen breve"
          tooltipText={tooltipTexts.shortDescription}
          onChange={handleChange}
          error={errors.shortDescriptionError}
          rows={3}
          maxLength={150}
          isAccent={true}
        />

        <ClientFormTextArea
          label="Descripción completa"
          name="detailedDescription"
          value={formData.detailedDescription || ""}
          placeholder="Agregue una descripción completa y detallada"
          tooltipText={tooltipTexts.detailedDescription}
          onChange={handleChange}
          error={errors.detailedDescriptionError}
          rows={6}
          maxLength={1500}
          isAccent={true}
        />

        <StepNavigationButtons
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={onPrevious}
          onNext={handleNext}
        />
      </form>
    </div>
  );
}
