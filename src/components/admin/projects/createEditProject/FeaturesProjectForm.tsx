import { useCallback, useMemo } from "react";
import type { ProjectFormData } from "@/src/interfaces";
import { useFeaturesProjectValidation } from "@/src/hooks/projects";
import { getFeaturesTooltipTexts, getFeatureVisibility } from "@/src/shared";
import {
  AdminFormCheckboxToggle,
  AdminFormInput,
  AdminFormSelect,
} from "@/src/components/shared";
import { StepNavigationButtons } from "../StepNavigationButtons";

interface FeaturesProjectFormProps {
  formData: ProjectFormData;
  onChange: (updatedData: Partial<ProjectFormData>) => void;
  onSubmit: (data: Partial<ProjectFormData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  isProperty: boolean;
}

export function FeaturesProjectForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  isProperty,
}: FeaturesProjectFormProps) {
  const { errors, validateFields, validateField } =
    useFeaturesProjectValidation(formData, isProperty);

  const featureVisibility = useMemo(
    () => getFeatureVisibility(formData.propertyType?.id),
    [formData.propertyType?.id]
  );

  const shouldShowField = useCallback(
    (field: string) => featureVisibility[field] ?? false,
    [featureVisibility]
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
    () => getFeaturesTooltipTexts(formData.projectType?.id),
    [formData.projectType?.id]
  );

  return (
    <div className="container mx-auto w-full rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {formData.projectType?.id === 1
          ? "Características del Proyecto"
          : "Características de la Propiedad"}
      </h2>

      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormInput
            label="Área Total (m²)"
            type="number"
            name="totalArea"
            min={0}
            value={formData.totalArea || ""}
            onChange={handleChange}
            placeholder="Área total"
            error={errors.totalAreaError}
            tooltipText={tooltipTexts.totalArea}
          />

          <AdminFormInput
            label="Área Construida (m²)"
            type="number"
            name="builtArea"
            min={0}
            value={formData.builtArea || ""}
            onChange={handleChange}
            placeholder="Área construida"
            error={errors.builtAreaError}
            tooltipText={tooltipTexts.builtArea}
          />

          {shouldShowField("socioeconomicLevel") &&
            (formData.projectType?.id === 2 ||
              formData.projectType?.id === 3) && (
              <AdminFormSelect
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
              />
            )}

          {shouldShowField("yearBuilt") &&
            (formData.projectType?.id === 2 ||
              formData.projectType?.id === 3) && (
              <AdminFormSelect
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
              />
            )}

          {shouldShowField("bedrooms") && (
            <AdminFormInput
              label="Número de Habitaciones"
              type="number"
              name="bedrooms"
              min={0}
              value={formData.bedrooms || ""}
              onChange={handleChange}
              placeholder="Número de habitaciones"
              error={errors.bedroomsError}
              tooltipText={tooltipTexts.bedrooms}
            />
          )}

          {shouldShowField("bathrooms") && (
            <AdminFormInput
              label="Número de Baños"
              type="number"
              name="bathrooms"
              min={0}
              value={formData.bathrooms || ""}
              onChange={handleChange}
              placeholder="Número de baños"
              error={errors.bathroomsError}
              tooltipText={tooltipTexts.bathrooms}
            />
          )}

          {shouldShowField("lobbies") && (
            <AdminFormInput
              label="Número de Salas de Estar"
              type="number"
              name="lobbies"
              min={0}
              value={formData.lobbies || ""}
              onChange={handleChange}
              placeholder="Número de salas de estar"
              error={errors.lobbiesError}
              tooltipText={tooltipTexts.lobbies}
            />
          )}

          {shouldShowField("freeHeight") && (
            <AdminFormInput
              label="Altura Libre (m)"
              type="number"
              name="freeHeight"
              min={0}
              value={formData.freeHeight || ""}
              onChange={handleChange}
              placeholder="Altura libre"
              error={errors.freeHeightError}
              tooltipText={tooltipTexts.freeHeight}
            />
          )}

          {shouldShowField("width") && (
            <AdminFormInput
              label="Frente (m)"
              type="number"
              name="width"
              min={0}
              value={formData.width || ""}
              onChange={handleChange}
              placeholder="Medida del frente"
              error={errors.widthError}
              tooltipText={tooltipTexts.width}
            />
          )}

          {shouldShowField("length") && (
            <AdminFormInput
              label="Fondo (m)"
              type="number"
              name="length"
              min={0}
              value={formData.length || ""}
              onChange={handleChange}
              placeholder="Medida del fondo"
              error={errors.lengthError}
              tooltipText={tooltipTexts.length}
            />
          )}

          {shouldShowField("heavyParking") && (
            <AdminFormInput
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
            />
          )}

          {shouldShowField("towers") && (
            <AdminFormInput
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
              placeholder={
                formData.projectType?.id === 1
                  ? "Número de torres"
                  : "Número de torre"
              }
              error={
                formData.projectType?.id === 1 ? errors.towersError : undefined
              }
              tooltipText={tooltipTexts.towers}
            />
          )}

          {shouldShowField("floorNumber") &&
            (formData.projectType?.id === 2 ||
              formData.projectType?.id === 3) && (
              <AdminFormInput
                label="Número de Piso"
                type="number"
                name="floorNumber"
                min={0}
                value={formData.floorNumber || ""}
                onChange={handleChange}
                placeholder="Número de piso"
                tooltipText={tooltipTexts.floorNumber}
              />
            )}

          {shouldShowField("storageUnits") && (
            <AdminFormInput
              label="Depósitos"
              type="number"
              name="storageUnits"
              min={0}
              value={formData.storageUnits || ""}
              onChange={handleChange}
              placeholder="Número de depósitos"
              tooltipText={tooltipTexts.storageUnits}
            />
          )}

          <AdminFormInput
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
          />
        </div>

        {(formData.propertyType?.id === 1001 ||
          formData.propertyType?.id === 1002) && (
          <div>
            <h3 className="mb-4 text-center text-lg font-semibold text-premium-primary dark:text-premium-primaryLight">
              Características Adicionales
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {shouldShowField("elevator") && (
                <AdminFormCheckboxToggle
                  label="Elevador"
                  name="elevator"
                  checked={formData.elevator || false}
                  onChange={(checked) => onChange({ elevator: checked })}
                />
              )}

              {shouldShowField("terrace") && (
                <AdminFormCheckboxToggle
                  label="Terraza"
                  name="terrace"
                  checked={formData.terrace || false}
                  onChange={(checked) => onChange({ terrace: checked })}
                />
              )}

              {shouldShowField("balcony") && (
                <AdminFormCheckboxToggle
                  label="Balcón"
                  name="balcony"
                  checked={formData.balcony || false}
                  onChange={(checked) => onChange({ balcony: checked })}
                />
              )}

              {shouldShowField("garden") && (
                <AdminFormCheckboxToggle
                  label="Jardín"
                  name="garden"
                  checked={formData.garden || false}
                  onChange={(checked) => onChange({ garden: checked })}
                />
              )}

              {shouldShowField("laundryArea") && (
                <AdminFormCheckboxToggle
                  label="Área de Lavado"
                  name="laundryArea"
                  checked={formData.laundryArea || false}
                  onChange={(checked) => onChange({ laundryArea: checked })}
                />
              )}

              {shouldShowField("customizationOptions") &&
                (formData.projectType?.id === 2 ||
                  formData.projectType?.id === 3) && (
                  <AdminFormCheckboxToggle
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
