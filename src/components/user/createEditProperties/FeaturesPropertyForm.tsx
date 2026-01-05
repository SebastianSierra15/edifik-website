"use client";

import { useCallback, useMemo } from "react";
import { ProjectFormData } from "@/src/interfaces";
import { useFeaturesProjectValidation } from "@/src/hooks/projects";
import { StepNavigationButtons } from "@/src/components/user";
import {
  ClientFormInput,
  ClientFormSelect,
  ClientFormCheckboxToggle,
} from "@/src/components/shared";

interface FeaturesPropertyFormProps {
  formData: ProjectFormData;
  onChange: (updatedData: Partial<ProjectFormData>) => void;
  onSubmit: (data: Partial<ProjectFormData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
}

export function FeaturesPropertyForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
}: FeaturesPropertyFormProps) {
  const { errors, validateFields, validateField } =
    useFeaturesProjectValidation(formData, true);

  const shouldShowField = useCallback(
    (field: string) => {
      const propertyTypeId = formData.propertyType?.id;

      const conditions: Record<string, boolean> = {
        socioeconomicLevel: propertyTypeId === 1001 || propertyTypeId === 1002,
        yearBuilt: propertyTypeId === 1001 || propertyTypeId === 1002,
        bedrooms: propertyTypeId === 1001 || propertyTypeId === 1002,
        storageUnits: propertyTypeId === 1001 || propertyTypeId === 1002,
        balcony: propertyTypeId === 1001 || propertyTypeId === 1002,
        laundryArea: propertyTypeId === 1001 || propertyTypeId === 1002,
        customizationOptions:
          propertyTypeId === 1001 || propertyTypeId === 1002,
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

      return conditions[field] ?? false;
    },
    [formData.propertyType?.id]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type } = e.target;
      const updatedValue =
        type === "number" ? (value === "" ? "" : parseFloat(value)) : value;

      onChange({ [name]: updatedValue });
      validateField(`${name}Error` as keyof typeof errors, updatedValue);
    },
    [onChange, validateField, errors]
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      const selectedValue = parseInt(value, 10);

      onChange({ [name]: selectedValue });
      validateField(`${name}Error` as keyof typeof errors, selectedValue);
    },
    [onChange, validateField, errors]
  );

  const handleNext = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (validateFields()) {
        onNext();
      }
    },
    [validateFields, onNext]
  );

  const tooltipTexts = useMemo(
    () => ({
      totalArea: "Ingrese el área total de la propiedad en metros cuadrados.",
      builtArea:
        "Ingrese el área construida de la propiedad en metros cuadrados, considerando únicamente las áreas cubiertas.",
      socioeconomicLevel:
        "Seleccione el nivel socioeconÇümico asignado a la propiedad según la clasificación oficial del sector.",
      yearBuilt:
        "Seleccione el año en que la propiedad fue construida o su estructura original terminada.",
      bedrooms: "Especifique cuántas habitaciones tiene la propiedad.",
      bathrooms: "Indique la cantidad total de baños que tiene la propiedad.",
      lobbies:
        "Ingrese el número de salas de estar (salones o lobbies) que tiene la propiedad.",
      freeHeight:
        "Especifique la altura libre de la propeidad en metros, considerando el espacio disponible entre el suelo y el techo.",
      width:
        "Indique el frente total de la propiedad en metros. Este valor corresponde a la dimensión horizontal.",
      length:
        "Especifique el fondo total de la propiedad en metros. Este valor corresponde a la dimensión vertical.",
      heavyParking:
        "Indique cuántos espacios de parqueo estarán disponibles para vehículos pesados.",
      towers:
        "Indique la torre en la que se encuentra la propiedad (si aplica).",
      floorNumber:
        "Ingrese el número de piso donde se encuentra el apartamento. Por ejemplo, '3' para el tercer piso.",
      storageUnits:
        "Especifique el número total de depósitos (bodegas o cuartos de almacenamiento) disponibles para la propiedad.",
      parkingSpots:
        "Especifique el número total de espacios de parqueo que estarán disponibles.",
    }),
    []
  );

  return (
    <div className="container mx-auto w-full rounded-lg bg-client-background p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold text-client-accent">
        Características de la Propiedad
      </h2>

      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ClientFormInput
            label="Área Total (m²)"
            type="number"
            name="totalArea"
            min={0}
            value={formData.totalArea || ""}
            onChange={handleChange}
            placeholder="Área total"
            error={errors.totalAreaError}
            tooltipText={tooltipTexts.totalArea}
            isAccent={true}
          />

          <ClientFormInput
            label="Área Construida (m²)"
            type="number"
            name="builtArea"
            min={0}
            value={formData.builtArea || ""}
            onChange={handleChange}
            placeholder="Área construida"
            error={errors.builtAreaError}
            tooltipText={tooltipTexts.builtArea}
            isAccent={true}
          />

          {shouldShowField("socioeconomicLevel") && (
            <ClientFormSelect
              label="Nivel Socioeconómico"
              name="socioeconomicLevel"
              value={formData.socioeconomicLevel || ""}
              onChange={handleSelectChange}
              options={[1, 2, 3, 4, 5, 6].map((level) => ({
                id: level,
                name: `Estrato ${level}`,
              }))}
              error={errors.socioeconomicLevelError}
              tooltipText={tooltipTexts.socioeconomicLevel}
              isAccent={true}
            />
          )}

          {shouldShowField("yearBuilt") && (
            <ClientFormSelect
              label="Año de Construcción"
              name="yearBuilt"
              value={formData.yearBuilt || ""}
              onChange={handleSelectChange}
              options={Array.from(
                { length: new Date().getFullYear() - 1950 + 1 },
                (_, i) => ({
                  id: 1950 + i,
                  name: (1950 + i).toString(),
                })
              )}
              error={errors.yearBuiltError}
              tooltipText={tooltipTexts.yearBuilt}
              isAccent={true}
            />
          )}

          {shouldShowField("bedrooms") && (
            <ClientFormInput
              label="Número de Habitaciones"
              type="number"
              name="bedrooms"
              min={0}
              value={formData.bedrooms || ""}
              onChange={handleChange}
              placeholder="Número de habitaciones"
              error={errors.bedroomsError}
              tooltipText={tooltipTexts.bedrooms}
              isAccent={true}
            />
          )}

          {shouldShowField("bathrooms") && (
            <ClientFormInput
              label="Número de Baños"
              type="number"
              name="bathrooms"
              min={0}
              value={formData.bathrooms || ""}
              onChange={handleChange}
              placeholder="Número de baños"
              error={errors.bathroomsError}
              tooltipText={tooltipTexts.bathrooms}
              isAccent={true}
            />
          )}

          {shouldShowField("lobbies") && (
            <ClientFormInput
              label="Número de Salas de Estar"
              type="number"
              name="lobbies"
              min={0}
              value={formData.lobbies || ""}
              onChange={handleChange}
              placeholder="Número de salas de estar"
              error={errors.lobbiesError}
              tooltipText={tooltipTexts.lobbies}
              isAccent={true}
            />
          )}

          {shouldShowField("freeHeight") && (
            <ClientFormInput
              label="Altura Libre (m)"
              type="number"
              name="freeHeight"
              min={0}
              value={formData.freeHeight || ""}
              onChange={handleChange}
              placeholder="Altura libre"
              error={errors.freeHeightError}
              tooltipText={tooltipTexts.freeHeight}
              isAccent={true}
            />
          )}

          {shouldShowField("width") && (
            <ClientFormInput
              label="Frente (m)"
              type="number"
              name="width"
              min={0}
              value={formData.width || ""}
              onChange={handleChange}
              placeholder="Medida del frente"
              error={errors.widthError}
              tooltipText={tooltipTexts.width}
              isAccent={true}
            />
          )}

          {shouldShowField("length") && (
            <ClientFormInput
              label="Fondo (m)"
              type="number"
              name="length"
              min={0}
              value={formData.length || ""}
              onChange={handleChange}
              placeholder="Medida del fondo"
              error={errors.lengthError}
              tooltipText={tooltipTexts.length}
              isAccent={true}
            />
          )}

          {shouldShowField("heavyParking") && (
            <ClientFormInput
              label={
                formData.propertyType?.id === 1005
                  ? "Espacios de Parqueo Privado"
                  : "Espacios de Parqueo Pesado"
              }
              type="number"
              name="heavyParking"
              min={0}
              value={formData.heavyParking || ""}
              onChange={handleChange}
              placeholder="Número de parqueos para vehículos pesados"
              tooltipText={tooltipTexts.heavyParking}
              isAccent={true}
            />
          )}

          {shouldShowField("towers") && (
            <ClientFormInput
              label={
                formData.projectType?.id === 2 || formData.projectType?.id === 3
                  ? "Número de Torre"
                  : "Número de Torres"
              }
              type="number"
              name="towers"
              min={0}
              value={formData.towers || ""}
              onChange={handleChange}
              placeholder="Número de torre"
              tooltipText={tooltipTexts.towers}
              isAccent={true}
            />
          )}

          {shouldShowField("floorNumber") && (
            <ClientFormInput
              label="Número de Piso"
              type="number"
              name="floorNumber"
              min={0}
              value={formData.floorNumber || ""}
              onChange={handleChange}
              placeholder="Número de piso"
              tooltipText={tooltipTexts.floorNumber}
              isAccent={true}
            />
          )}

          {shouldShowField("storageUnits") && (
            <ClientFormInput
              label="Depósitos"
              type="number"
              name="storageUnits"
              min={0}
              value={formData.storageUnits || ""}
              onChange={handleChange}
              placeholder="Número de depósitos"
              tooltipText={tooltipTexts.storageUnits}
              isAccent={true}
            />
          )}

          <ClientFormInput
            label={
              formData.propertyType?.id === 1005
                ? "Espacios de Parqueo Sociales"
                : "Espacios de Parqueo"
            }
            type="number"
            name="parkingSpots"
            min={0}
            value={formData.parkingSpots || ""}
            onChange={handleChange}
            placeholder="Número de espacios de parqueo"
            tooltipText={tooltipTexts.parkingSpots}
            isAccent={true}
          />
        </div>

        {(formData.propertyType?.id === 1001 ||
          formData.propertyType?.id === 1002) && (
          <div>
            <h3 className="mb-4 text-center text-lg font-semibold text-client-accent">
              Características Adicionales
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {shouldShowField("elevator") && (
                <ClientFormCheckboxToggle
                  label="Elevador"
                  name="elevator"
                  checked={formData.elevator || false}
                  onChange={(checked) => onChange({ elevator: checked })}
                />
              )}

              {shouldShowField("terrace") && (
                <ClientFormCheckboxToggle
                  label="Terraza"
                  name="terrace"
                  checked={formData.terrace || false}
                  onChange={(checked) => onChange({ terrace: checked })}
                />
              )}

              {shouldShowField("balcony") && (
                <ClientFormCheckboxToggle
                  label="Balcón"
                  name="balcony"
                  checked={formData.balcony || false}
                  onChange={(checked) => onChange({ balcony: checked })}
                />
              )}

              {shouldShowField("garden") && (
                <ClientFormCheckboxToggle
                  label="Jardín"
                  name="garden"
                  checked={formData.garden || false}
                  onChange={(checked) => onChange({ garden: checked })}
                />
              )}

              {shouldShowField("laundryArea") && (
                <ClientFormCheckboxToggle
                  label="Área de Lavado"
                  name="laundryArea"
                  checked={formData.laundryArea || false}
                  onChange={(checked) => onChange({ laundryArea: checked })}
                />
              )}

              {shouldShowField("customizationOptions") && (
                <ClientFormCheckboxToggle
                  label="Opciones de Personalización"
                  name="customizationOptions"
                  checked={formData.customizationOptions || false}
                  onChange={(checked) =>
                    onChange({ customizationOptions: checked })
                  }
                />
              )}
            </div>
          </div>
        )}

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
