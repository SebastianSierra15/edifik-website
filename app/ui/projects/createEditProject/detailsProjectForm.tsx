import { useCallback, useMemo } from "react";
import clsx from "clsx";
import {
  CommonArea,
  NearbyService,
  HousingType,
  ProjectData,
} from "@/lib/definitios";
import { formatNumber } from "@/utils/formatters";
import { useDetailsProjectValidation } from "@/app/hooks/projects/createEditProject/useDetailsProjectValidation";
import StepNavigationButtons from "../../admin/stepNavigationButtons";
import FormInput from "@/app/ui/modals/formInput";
import FormSelect from "@/app/ui/modals/formSelect";
import FormMultiSelect from "@/app/ui/modals/formMultiSelect";
import FormDatePicker from "@/app/ui/modals/formDatePicker";

interface DetailsProjectFormProps {
  formData: ProjectData;
  onChange: (updatedData: Partial<ProjectData>) => void;
  onSubmit: (data: Partial<ProjectData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  commonAreas: CommonArea[];
  nearbyServices: NearbyService[];
  housingTypes: HousingType[];
}

export default function DetailsProjectForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  commonAreas,
  nearbyServices,
  housingTypes,
}: DetailsProjectFormProps) {
  const { errors, validateFields, validateField } =
    useDetailsProjectValidation(formData);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = value ? parseInt(value, 10) : 0;

    onChange({ price: numericValue });
    validateField("priceError", numericValue);
  };

  const handleChangeText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (formData[name as keyof ProjectData] !== value) {
        onChange({ [name]: value });
        validateField(`${name}Error` as keyof typeof errors, value);
      }
    },
    [onChange, validateField, formData]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type } = e.target;
      const updatedValue =
        type === "number" ? (value === "" ? "" : parseFloat(value)) : value;

      if (formData[name as keyof ProjectData] !== updatedValue) {
        onChange({ [name]: updatedValue });
        validateField(`${name}Error` as keyof typeof errors, updatedValue);
      }
    },
    [onChange, validateField, formData]
  );

  const handleDateChange = (date: Date | null) => {
    onChange({ availableDate: date ?? undefined });
    validateField("dateError" as keyof typeof errors, date);
  };

  const handleSelectChange = useCallback(
    (
      e: React.ChangeEvent<HTMLSelectElement>,
      name: "commonAreas" | "nearbyServices" | "housingType"
    ) => {
      const id = parseInt(e.target.value, 10);
      if (!id) return;

      if (name === "housingType") {
        const selectedHousingType = housingTypes.find((type) => type.id === id);
        if (selectedHousingType && formData.housingType?.id !== id) {
          onChange({ housingType: selectedHousingType });
        }
        return;
      }

      const selectedItem =
        name === "commonAreas"
          ? commonAreas.find((area) => area.id === id)
          : nearbyServices.find((service) => service.id === id);

      if (
        selectedItem &&
        !formData[name]?.some((item) => item.id === selectedItem.id)
      ) {
        onChange({ [name]: [...(formData[name] || []), selectedItem] });
      }
    },
    [onChange, formData, housingTypes, commonAreas, nearbyServices]
  );

  const handleRemoveTag = useCallback(
    (id: number, name: "commonAreas" | "nearbyServices") => {
      const updatedItems =
        formData[name]?.filter((item) => item.id !== id) || [];
      onChange({ [name]: updatedItems });
    },
    [onChange, formData]
  );

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault();
    const isValid = validateFields();
    if (isValid) {
      onNext();
    }
  };

  const tooltipTexts = useMemo(
    () => ({
      price:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Indique el precio de la propiedad."
          : "Indique el precio por unidad del proyecto.",
      availableUnits:
        "Especifique el número de unidades disponibles para este proyecto.",
      housingType: "Seleccione el tipo de vivienda.",
      availableDate:
        "Seleccione la fecha estimada para la entrega del proyecto (mes/año).",
      complexName: "Nombre del conjunto residencial (si aplica).",
      commonAreas:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Seleccione las áreas comunes disponibles en la propiedad."
          : "Seleccione las áreas comunes disponibles en el proyecto.",
      nearbyServices:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Seleccione los servicios cercanos a la propiedad."
          : "Seleccione los servicios cercanos al proyecto.",
    }),
    [formData.projectType?.id]
  );

  return (
    <div className="container mx-auto w-full rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {formData.projectType?.id === 1
          ? "Detalles del Proyecto"
          : "Detalles de la Propiedad"}
      </h2>

      <form onSubmit={handleNext} className="space-y-6">
        {formData.projectType?.id === 2 ||
          (formData.projectType?.id === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Precio"
                type="text"
                name="price"
                value={formData.price ? formatNumber(formData.price) : ""}
                onChange={handlePriceChange}
                placeholder="Ingrese el precio"
                error={errors.priceError}
                tooltipText={tooltipTexts.price}
              />

              <FormInput
                label="Unidades Disponibles"
                type="number"
                name="availableUnits"
                value={formData.availableUnits || ""}
                onChange={handleChange}
                placeholder="Número de unidades disponibles"
                error={errors.availableUnitsError}
                min={0}
                tooltipText={tooltipTexts.availableUnits}
              />
            </div>
          ))}

        <div
          className={clsx(
            "grid grid-cols-1 gap-4",
            (formData.propertyType?.id === 1001 ||
              formData.propertyType?.id === 1002) &&
              "sm:grid-cols-2"
          )}
        >
          {(formData.propertyType?.id === 1001 ||
            formData.propertyType?.id === 1002) && (
            <FormSelect
              label="Tipo de Vivienda"
              name="housingType"
              value={formData.housingType?.id || ""}
              options={housingTypes}
              onChange={(e) => handleSelectChange(e, "housingType")}
              error={errors.housingTypeError}
              tooltipText={tooltipTexts.housingType}
            />
          )}

          <FormDatePicker
            label="Fecha Estimada de Entrega"
            name="availableDate"
            value={formData.availableDate ?? null}
            onChange={handleDateChange}
            tooltipText={tooltipTexts.availableDate}
          />
        </div>

        {formData.propertyType?.id === 1002 &&
          (formData.projectType?.id === 2 ||
            formData.projectType?.id === 3) && (
            <FormInput
              label="Nombre del conjunto"
              type="text"
              name="complexName"
              value={formData.complexName || ""}
              onChange={handleChangeText}
              maxLength={100}
              placeholder="Ingrese el nombre del proyecto"
              tooltipText={tooltipTexts.complexName}
            />
          )}

        <FormMultiSelect
          label="Áreas Comunes"
          name="commonAreas"
          selectedItems={formData.commonAreas || []}
          options={commonAreas}
          onSelect={handleSelectChange}
          onRemove={handleRemoveTag}
          tooltipText={tooltipTexts.commonAreas}
        />

        <FormMultiSelect
          label="Servicios Cercanos"
          name="nearbyServices"
          selectedItems={formData.nearbyServices || []}
          options={nearbyServices}
          onSelect={handleSelectChange}
          onRemove={handleRemoveTag}
          tooltipText={tooltipTexts.nearbyServices}
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
