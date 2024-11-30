"use client";

import { useState } from "react";
import { propertyType, ProjectData } from "@/lib/definitios";
import {
  AiOutlineExclamationCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import StepNavigationButtons from "../../stepNavigationButtons";

type BasicProjectFormProps = {
  formData: ProjectData;
  onChange: (updatedData: Partial<ProjectData>) => void;
  onSubmit: (data: Partial<ProjectData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  propertyTypes: propertyType[];
  currentStep: number;
  totalSteps: number;
};

export default function BasicProjectForm({
  formData,
  onChange,
  propertyTypes,
  onPrevious,
  currentStep,
  totalSteps,
  onNext,
}: BasicProjectFormProps) {
  const [errors, setErrors] = useState({
    nameError: "",
    shortDescriptionError: "",
    detailedDescriptionError: "",
    projectTypeError: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({ [e.target.name]: e.target.value });
    setErrors({ ...errors, [`${e.target.name}Error`]: "" });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ membership: e.target.checked ? 1004 : 1001 });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);

    const selectedOption = propertyTypes.find((type) => type.id === selectedId);

    if (selectedOption) {
      onChange({ propertyType: selectedOption });
      setErrors((prevErrors) => ({ ...prevErrors, projectTypeError: "" }));
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
    if (!formData.propertyType || !formData.propertyType.id)
      newErrors.projectTypeError = "Seleccione el tipo de propiedad.";

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
          <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-2">
            Nombre del proyecto{" "}
            <span className="text-textPrimary dark:text-textPrimary -ml-1">
              *
            </span>
            <span className="group relative">
              <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
              <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                <p className="text-xs">
                  Nombre del proyecto que se mostrará al público.
                </p>
              </div>
            </span>
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
            placeholder="Ingrese el nombre del proyecto"
            required
          />
          {errors.nameError && (
            <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
              <AiOutlineExclamationCircle className="w-4 h-4" />
              {errors.nameError}
            </div>
          )}
        </div>

        <div>
          <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-2">
            Tipo de propiedad{" "}
            <span className="text-textPrimary dark:text-textPrimary -ml-1">
              *
            </span>
            <span className="group relative">
              <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
              <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                <p className="text-xs">
                  Seleccione el tipo de propiedad que más se ajuste a su
                  proyecto.
                </p>
              </div>
            </span>
          </label>
          <select
            name="projectType"
            value={formData.propertyType?.id || ""}
            onChange={handleSelectChange}
            className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
              errors.projectTypeError
                ? "border-red-500"
                : "border-borderColor dark:border-borderColorHover"
            }`}
            required
          >
            <option value="">Seleccione el tipo de propiedad</option>
            {propertyTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.projectTypeError && (
            <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
              <AiOutlineExclamationCircle className="w-4 h-4" />
              {errors.projectTypeError}
            </div>
          )}
        </div>

        <div>
          <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-2">
            Resumen breve{" "}
            <span className="text-textPrimary dark:text-textPrimary -ml-1">
              *
            </span>
            <span className="group relative">
              <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
              <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                <p className="text-xs">
                  Escriba un resumen breve que describa las principales
                  características del proyecto.
                </p>
              </div>
            </span>
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
            required
          />
          {errors.shortDescriptionError && (
            <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
              <AiOutlineExclamationCircle className="w-4 h-4" />
              {errors.shortDescriptionError}
            </div>
          )}
        </div>

        <div>
          <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-2">
            Descripción completa{" "}
            <span className="text-textPrimary dark:text-textPrimary -ml-1">
              *
            </span>
            <span className="group relative">
              <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
              <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                <p className="text-xs">
                  Incluya una descripción detallada que explique las
                  características principales del proyecto.
                </p>
              </div>
            </span>
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
            required
          />
          {errors.detailedDescriptionError && (
            <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
              <AiOutlineExclamationCircle className="w-4 h-4" />
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
