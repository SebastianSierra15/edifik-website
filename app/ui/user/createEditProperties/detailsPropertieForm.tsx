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
import StepNavigationButtons from "../stepNavigationButtons";
import {
  ClientFormInput,
  ClientFormSelect,
  ClientFormMultiSelect,
} from "@/src/components/shared";

interface DetailsPropertieFormProps {
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

export default function DetailsPropertieForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  commonAreas,
  nearbyServices,
  housingTypes,
}: DetailsPropertieFormProps) {
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

  const isApartmentOrHouse =
    formData.propertyType?.id === 1001 || formData.propertyType?.id === 1002;

  const tooltipTexts = useMemo(
    () => ({
      price: "Indique el precio de la propiedad.",
      housingType: "Seleccione el tipo de vivienda.",
      complexName: "Nombre del conjunto residencial (si aplica).",
      commonAreas: "Seleccione las áreas comunes disponibles en la propiedad.",
      nearbyServices: "Seleccione los servicios cercanos a la propiedad.",
    }),
    []
  );

  return (
    <div className="container mx-auto w-full rounded-lg bg-client-background p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold text-client-accent">
        Detalles de la Propiedad
      </h2>

      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid gap-4 grid-cols-1">
          <ClientFormInput
            label="Precio"
            type="text"
            name="price"
            value={formData.price ? formatNumber(formData.price) : ""}
            onChange={handlePriceChange}
            placeholder="Ingrese el precio"
            error={errors.priceError}
            tooltipText={tooltipTexts.price}
            isAccent={true}
          />
        </div>

        {isApartmentOrHouse && (
          <div
            className={clsx(
              "grid grid-cols-1 gap-4",
              isApartmentOrHouse && "sm:grid-cols-2"
            )}
          >
            {isApartmentOrHouse && (
              <ClientFormSelect
                label="Tipo de Vivienda"
                name="housingType"
                value={formData.housingType?.id || ""}
                options={housingTypes}
                onChange={(e) => handleSelectChange(e, "housingType")}
                error={errors.housingTypeError}
                tooltipText={tooltipTexts.housingType}
                isAccent={true}
              />
            )}
          </div>
        )}

        {formData.propertyType?.id === 1002 && (
          <ClientFormInput
            label="Nombre del conjunto"
            type="text"
            name="complexName"
            value={formData.complexName || ""}
            onChange={handleChangeText}
            maxLength={100}
            placeholder="Ingrese el nombre del conjunto en donde se ubica la propiedad"
            tooltipText={tooltipTexts.complexName}
            isAccent={true}
          />
        )}

        <ClientFormMultiSelect
          label="Áreas Comunes"
          name="commonAreas"
          selectedItems={formData.commonAreas || []}
          options={commonAreas}
          onSelect={handleSelectChange}
          onRemove={handleRemoveTag}
          tooltipText={tooltipTexts.commonAreas}
        />

        <ClientFormMultiSelect
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
