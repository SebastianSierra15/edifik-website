"use client";

import { useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import StepNavigationButtons from "../../stepNavigationButtons";
import { HousingType, PropertyData } from "@/lib/definitios";

type FeaturesPropertyFormProps = {
  formData: PropertyData;
  onChange: (updatedData: Partial<PropertyData>) => void;
  onSubmit: (data: Partial<PropertyData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  housingTypes: HousingType[];
};

export default function FeaturesPropertyForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  housingTypes,
}: FeaturesPropertyFormProps) {
  const [errors, setErrors] = useState({
    areaError: "",
    housingTypeError: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const updatedValue =
      e.target.type === "number" ? parseInt(value) || 0 : value;

    const finalValue =
      name === "housingType"
        ? housingTypes.find((type) => type.id === parseInt(value))
        : updatedValue;

    onChange({ [name]: finalValue });

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [`${name}Error`]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = { ...errors };

    if (!formData.area) newErrors.areaError = "El área es obligatoria.";
    if (!formData.housingType)
      newErrors.housingTypeError = "Seleccione un tipo de vivienda.";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6 bg-backgroundLight dark:bg-backgroundDark rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary dark:text-primaryLight text-center mb-6">
        Características de la Propiedad
      </h2>

      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-textPrimary dark:text-textPrimary mb-2">
              Área Construida (m²) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="area"
              min="0"
              value={formData.area || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                errors.areaError
                  ? "border-red-500"
                  : "border-borderColor dark:border-borderColorHover"
              }`}
              placeholder="Ingrese el área"
              required
            />
            {errors.areaError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.areaError}
              </div>
            )}
          </div>

          <div>
            <label className="block text-textPrimary dark:text-textPrimary mb-2">
              Tipo de Vivienda <span className="text-red-500">*</span>
            </label>
            <select
              name="housingType"
              value={formData.housingType?.id || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                errors.housingTypeError
                  ? "border-red-500"
                  : "border-borderColor dark:border-borderColorHover"
              }`}
              required
            >
              <option value="">Seleccione un tipo de vivienda</option>
              {housingTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.housingTypeError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.housingTypeError}
              </div>
            )}
          </div>

          <div>
            <label className="block text-textPrimary dark:text-textPrimary mb-2">
              Número de Habitaciones
            </label>
            <input
              type="number"
              name="rooms"
              min={0}
              value={formData.rooms || "0"}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
            />
          </div>

          <div>
            <label className="block text-textPrimary dark:text-textPrimary mb-2">
              Número de Baños
            </label>
            <input
              type="number"
              name="bathrooms"
              min={0}
              value={formData.bathrooms || "0"}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
            />
          </div>

          <div>
            <label className="block text-textPrimary dark:text-textPrimary mb-2">
              Número de Salas de Estar
            </label>
            <input
              type="number"
              name="lobbies"
              min={0}
              value={formData.lobbies || "0"}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
            />
          </div>
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
