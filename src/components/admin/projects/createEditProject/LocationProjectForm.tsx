import { memo } from "react";
import type { City, Departament, ProjectFormData } from "@/src/interfaces";
import { useLocationProjectForm } from "@/src/hooks/projects";
import { FormSelect, FormInput } from "@/src/components/shared";
import { StepNavigationButtons } from "../StepNavigationButtons";
import { LocationMapSection } from "./LocationMapSection";

interface LocationProjectFormProps {
  formData: ProjectFormData;
  onChange: (updatedData: Partial<ProjectFormData>) => void;
  onSubmit: (data: Partial<ProjectFormData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  departaments: Departament[];
  cities: City[];
  mapAddress: string;
  setMapAddress: (value: string) => void;
  isProperty: boolean;
}

const LocationProjectForm = memo(function LocationProjectForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  departaments,
  cities,
  mapAddress,
  setMapAddress,
  isProperty,
}: LocationProjectFormProps) {
  const {
    errors,
    propertyOptions,
    cityOptions,
    isMapsReady,
    handleDepartamentChange,
    handleCityChange,
    handleAddressSelect,
    handleNext,
    tooltipTexts,
    handleMapAddressChange,
    handleMapLocationSelect,
  } = useLocationProjectForm({
    formData,
    departaments,
    cities,
    mapAddress,
    setMapAddress,
    onChange,
    onNext,
    isProperty,
  });

  return (
    <div className="container mx-auto w-full rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {formData.projectType?.id
          ? "Ubicacion del Proyecto"
          : "Ubicacion de la Propiedad"}
      </h2>

      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormSelect
            label="Departamento"
            name="departament"
            value={formData.city?.departament?.id || ""}
            options={propertyOptions}
            onChange={handleDepartamentChange}
            error={errors.departamentError}
            tooltipText={tooltipTexts.departament}
          />

          <FormSelect
            label="Ciudad"
            name="city"
            value={formData.city?.id || ""}
            options={cityOptions}
            onChange={handleCityChange}
            error={errors.cityError}
            tooltipText={tooltipTexts.city}
          />
        </div>

        <div className="relative z-20 space-y-4">
          <FormInput
            label="Direccion Publica"
            name="address"
            type="text"
            placeholder="Ej: Calle 123 #45-67, Barrio XYZ"
            value={formData.address || ""}
            onChange={(e) => onChange({ address: e.target.value })}
            error={errors.addressError}
            tooltipText="Ingresa la direccion que se mostrara publicamente."
          />
        </div>

        <LocationMapSection
          mapAddress={mapAddress}
          isMapsReady={isMapsReady}
          onMapAddressChange={handleMapAddressChange}
          onAddressSelect={handleAddressSelect}
          label="Ubicacion en el Mapa"
          error={errors.mapAddressError}
          tooltipText="Busca la direccion en el mapa para obtener la ubicacion exacta."
          coordinates={{
            lat:
              typeof formData.latitude === "number"
                ? formData.latitude
                : 4.5709,
            lng:
              typeof formData.longitude === "number"
                ? formData.longitude
                : -74.2973,
          }}
          onLocationSelect={handleMapLocationSelect}
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
});

export { LocationProjectForm };
