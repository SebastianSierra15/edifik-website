"use client";

import { useState } from "react";
import { Category, PropertyType, PropertyData } from "@/lib/definitios";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import StepNavigationButtons from "../../stepNavigationButtons";

type BasicPropertyFormProps = {
  formData: PropertyData;
  onChange: (updatedData: Partial<PropertyData>) => void;
  onSubmit: (data: Partial<PropertyData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  categories: Category[];
  propertyTypes: PropertyType[];
  currentStep: number;
  totalSteps: number;
};

export default function BasicPropertyForm({
  formData,
  onChange,
  categories,
  propertyTypes,
  onPrevious,
  currentStep,
  totalSteps,
  onNext,
}: BasicPropertyFormProps) {
  const [errors, setErrors] = useState({
    nameError: "",
    shortDescriptionError: "",
    detailedDescriptionError: "",
    categoryError: "",
    propertyTypeError: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({ [e.target.name]: e.target.value });
    setErrors({ ...errors, [`${e.target.name}Error`]: "" });
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    field: "category" | "propertyType"
  ) => {
    const selectedId = parseInt(e.target.value);

    const selectedOption =
      field === "category"
        ? categories.find((cat) => cat.id === selectedId)
        : propertyTypes.find((type) => type.id === selectedId);

    if (selectedOption) {
      onChange({ [field]: selectedOption });
      setErrors((prevErrors) => ({ ...prevErrors, [`${field}Error`]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = { ...errors };

    if (!formData.name) newErrors.nameError = "El nombre es obligatorio.";
    if (!formData.shortDescription)
      newErrors.shortDescriptionError = "El resumen breve es obligatorio.";
    if (!formData.detailedDescription)
      newErrors.detailedDescriptionError =
        "La descripción completa es obligatoria.";
    if (!formData.category || !formData.category.id)
      newErrors.categoryError = "Seleccione una categoría.";
    if (!formData.propertyType || !formData.propertyType.id)
      newErrors.propertyTypeError = "Seleccione el tipo de propiedad.";

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
        Datos Básicos
      </h2>
      <form onSubmit={handleNext} className="space-y-6">
        <div>
          <label className="block text-textPrimary dark:text-textPrimary mb-2">
            Nombre de la propiedad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            maxLength={100}
            className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
              errors.nameError
                ? "border-red-500"
                : "border-borderColor dark:border-borderColorHover"
            }`}
            placeholder="Ingrese el nombre de la propiedad"
          />
          {errors.nameError && (
            <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
              <AiOutlineExclamationCircle className="w-5 h-5" />
              {errors.nameError}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-textPrimary dark:text-textPrimary mb-2">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category?.id || ""}
              onChange={(e) => handleSelectChange(e, "category")}
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                errors.categoryError
                  ? "border-red-500"
                  : "border-borderColor dark:border-borderColorHover"
              }`}
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.categoryError}
              </div>
            )}
          </div>

          <div>
            <label className="block text-textPrimary dark:text-textPrimary mb-2">
              Tipo de propiedad <span className="text-red-500">*</span>
            </label>
            <select
              name="propertyType"
              value={formData.propertyType?.id || ""}
              onChange={(e) => handleSelectChange(e, "propertyType")}
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                errors.propertyTypeError
                  ? "border-red-500"
                  : "border-borderColor dark:border-borderColorHover"
              }`}
            >
              <option value="">Seleccione el tipo</option>
              {propertyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.propertyTypeError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.propertyTypeError}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-textPrimary dark:text-textPrimary mb-2">
            Resumen breve <span className="text-red-500">*</span>
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription || ""}
            onChange={handleChange}
            maxLength={150}
            className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
              errors.shortDescriptionError
                ? "border-red-500"
                : "border-borderColor dark:border-borderColorHover"
            }`}
            placeholder="Agregue un resumen breve"
            rows={3}
          />
          {errors.shortDescriptionError && (
            <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
              <AiOutlineExclamationCircle className="w-5 h-5" />
              {errors.shortDescriptionError}
            </div>
          )}
        </div>

        <div>
          <label className="block text-textPrimary dark:text-textPrimary mb-2">
            Descripción completa <span className="text-red-500">*</span>
          </label>
          <textarea
            name="detailedDescription"
            value={formData.detailedDescription || ""}
            onChange={handleChange}
            maxLength={1000}
            className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
              errors.detailedDescriptionError
                ? "border-red-500"
                : "border-borderColor dark:border-borderColorHover"
            }`}
            placeholder="Agregue una descripción completa y detallada"
            rows={6}
          />
          {errors.detailedDescriptionError && (
            <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
              <AiOutlineExclamationCircle className="w-5 h-5" />
              {errors.detailedDescriptionError}
            </div>
          )}
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
