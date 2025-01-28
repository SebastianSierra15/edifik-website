import { useCallback, useMemo } from "react";
import { ProjectData } from "@/lib/definitios";
import { useFeaturesProjectValidation } from "@/app/hooks/projects/createEditProject/useFeaturesProjectValidation";
import StepNavigationButtons from "../../admin/stepNavigationButtons";
import FormInput from "@/app/ui/modals/formInput";
import FormSelect from "@/app/ui/modals/formSelect";
import FormCheckboxToggle from "@/app/ui/modals/formCheckboxToggle";

interface FeaturesProjectFormProps {
  formData: ProjectData;
  onChange: (updatedData: Partial<ProjectData>) => void;
  onSubmit: (data: Partial<ProjectData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
}

export default function FeaturesProjectForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
}: FeaturesProjectFormProps) {
  const { errors, validateFields, validateField } =
    useFeaturesProjectValidation(formData);

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
      totalArea:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Ingrese el área total de la propiedad en metros cuadrados."
          : "Ingrese el área total del proyecto en metros cuadrados.",
      builtArea:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Ingrese el área construida de la propiedad en metros cuadrados, considerando únicamente las áreas cubiertas."
          : "Ingrese el área construida del proyecto en metros cuadrados, considerando únicamente las áreas cubiertas.",
      socioeconomicLevel:
        "Seleccione el nivel socioeconómico asignado a la propiedad según la clasificación oficial del sector.",
      yearBuilt:
        "Seleccione el año en que la propiedad fue construida o su estructura original terminada.",
      bedrooms:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Especifique cuántas habitaciones tiene la propiedad."
          : "Especifique cuántas habitaciones tendrá el proyecto.",
      bathrooms:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Indique la cantidad total de baños que tiene la propiedad."
          : "Indique la cantidad total de baños que estarán incluidos en el proyecto.",
      lobbies:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Ingrese el número de salas de estar (salones o lobbies) que tiene la propiedad."
          : "Ingrese el número de salas de estar (salones o lobbies) que tendrá el proyecto.",
      freeHeight:
        "Especifique la altura libre del proyecto en metros, considerando el espacio disponible entre el suelo y el techo.",
      width:
        "Indique el frente total del proyecto en metros. Este valor corresponde a la dimensión horizontal.",
      length:
        "Especifique el fondo total del proyecto en metros. Este valor corresponde a la dimensión vertical.",
      heavyParking:
        "Indique cuántos espacios de parqueo estarán disponibles para vehículos pesados.",
      towers:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Indique la torre en la que se encuentra la propiedad (si aplica)."
          : "Ingrese la cantidad de torres que tendrá el proyecto, si corresponde.",
      floorNumber:
        "Ingrese el número de piso donde se encuentra el apartamento. Por ejemplo, '3' para el tercer piso.",
      storageUnits:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Especifique el número total de depósitos (bodegas o cuartos de almacenamiento) disponibles para la propiedad."
          : "Especifique el número total de depósitos (bodegas o cuartos de almacenamiento) disponibles en el proyecto.",
      parkingSpots:
        "Especifique el número total de espacios de parqueo que estarán disponibles.",
    }),
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
          <FormInput
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

          <FormInput
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
              <FormSelect
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
              <FormSelect
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
            <FormInput
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
            <FormInput
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
            <FormInput
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
            <FormInput
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
            <FormInput
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
            <FormInput
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
            <FormInput
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
            <FormInput
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
              <FormInput
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
            <FormInput
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

          <FormInput
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
                <FormCheckboxToggle
                  label="Elevador"
                  name="elevator"
                  checked={formData.elevator || false}
                  onChange={(checked) => onChange({ elevator: checked })}
                />
              )}

              {shouldShowField("terrace") && (
                <FormCheckboxToggle
                  label="Terraza"
                  name="terrace"
                  checked={formData.terrace || false}
                  onChange={(checked) => onChange({ terrace: checked })}
                />
              )}

              {shouldShowField("balcony") && (
                <FormCheckboxToggle
                  label="Balcón"
                  name="balcony"
                  checked={formData.balcony || false}
                  onChange={(checked) => onChange({ balcony: checked })}
                />
              )}

              {shouldShowField("garden") && (
                <FormCheckboxToggle
                  label="Jardín"
                  name="garden"
                  checked={formData.garden || false}
                  onChange={(checked) => onChange({ garden: checked })}
                />
              )}

              {shouldShowField("laundryArea") && (
                <FormCheckboxToggle
                  label="Área de Lavado"
                  name="laundryArea"
                  checked={formData.laundryArea || false}
                  onChange={(checked) => onChange({ laundryArea: checked })}
                />
              )}

              {shouldShowField("customizationOptions") &&
                (formData.projectType?.id === 2 ||
                  formData.projectType?.id === 3) && (
                  <FormCheckboxToggle
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
