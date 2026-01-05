"use client";

import { useMemo } from "react";
import { ProjectFormData, City, Departament } from "@/src/interfaces";
import { useLocationProjectForm } from "@/src/hooks/projects";
import { StepNavigationButtons } from "@/src/components/user";
import { LocationMapSection } from "@/src/components/admin";
import {
  ClientFormSearchAddress,
  ClientFormSelect,
  ClientFormInput,
} from "@/src/components/shared";

interface LocationPropertyFormProps {
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
}

export function LocationPropertyForm({
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
}: LocationPropertyFormProps) {
  const {
    errors,
    propertyOptions,
    cityOptions,
    isMapsReady,
    handleDepartamentChange,
    handleCityChange,
    handleAddressSelect,
    handleNext,
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
    isProperty: true,
  });

  const tooltipTexts = useMemo(
    () => ({
      departament:
        "Seleccione el departamento donde se encuentra la propiedad.",
      city: "Seleccione la ciudad correspondiente la propiedad.",
      address: "Ingrese la dirección de la propiedad.",
    }),
    []
  );

  return (
    <div className="container mx-auto w-full rounded-lg p-6 shadow-lg bg-client-background">
      <h2 className="mb-6 text-center text-2xl font-bold text-client-accent">
        Ubicación de la Propiedad"
      </h2>

      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ClientFormSelect
            label="Departamento"
            name="departament"
            value={formData.city?.departament?.id || ""}
            options={propertyOptions}
            onChange={handleDepartamentChange}
            error={errors.departamentError}
            tooltipText={tooltipTexts.departament}
            isAccent={true}
          />

          <ClientFormSelect
            label="Ciudad"
            name="city"
            value={formData.city?.id || ""}
            options={cityOptions}
            onChange={handleCityChange}
            error={errors.cityError}
            tooltipText={tooltipTexts.city}
            isAccent={true}
          />
        </div>

        <div className="relative z-20 space-y-4">
          <ClientFormInput
            label="Dirección Pública"
            name="address"
            type="text"
            placeholder="Ej: Calle 123 #45-67, Barrio XYZ"
            value={formData.address || ""}
            onChange={(e) => onChange({ address: e.target.value })}
            error={errors.addressError}
            tooltipText="Ingresa la dirección que se mostrará públicamente."
            isAccent={true}
          />

          <ClientFormSearchAddress
            label="Ubicación en el Mapa"
            value={mapAddress || ""}
            onChange={handleMapAddressChange}
            onSelect={handleAddressSelect}
            error={errors.mapAddressError}
            isLoaded={isMapsReady}
            tooltipText="Busca la dirección en el mapa para obtener la ubicación exacta."
          />
        </div>

        <div className="relative h-64 w-full">
          <LocationMapSection
            mapAddress={mapAddress || ""}
            isMapsReady={isMapsReady}
            onMapAddressChange={handleMapAddressChange}
            onAddressSelect={handleAddressSelect}
            onLocationSelect={handleMapLocationSelect}
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
            label="Dirección"
            tooltipText=""
            showSearch={false}
            showUserLocationButton={true}
          />
        </div>

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
