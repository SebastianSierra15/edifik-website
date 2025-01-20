"use client";

import { useState } from "react";
import { propertyType, ProjectData } from "@/lib/definitios";
import {
  AiOutlineExclamationCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import StepNavigationButtons from "../../admin/stepNavigationButtons";

type BasicProjectFormProps = {
  formData: ProjectData;
  onChange: (updatedData: Partial<ProjectData>) => void;
  onSubmit: (data: Partial<ProjectData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  propertyTypes: propertyType[];
  currentStep: number;
  totalSteps: number;
  isProperty: boolean;
};

export default function BasicProjectForm({
  formData,
  onChange,
  propertyTypes,
  onPrevious,
  currentStep,
  totalSteps,
  isProperty,
  onNext,
}: BasicProjectFormProps) {
  const [errors, setErrors] = useState({
    nameError: "",
    shortDescriptionError: "",
    detailedDescriptionError: "",
    propertyTypeError: "",
    projectTypeError: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange({ [e.target.name]: e.target.value });
    setErrors({ ...errors, [`${e.target.name}Error`]: "" });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ membership: e.target.checked ? 1004 : 1001 });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const selectedId = parseInt(value, 10);

    if (name === "propertyType") {
      const selectedPropertyType = propertyTypes.find(
        (type) => type.id === selectedId,
      );

      if (selectedPropertyType) {
        onChange({ propertyType: selectedPropertyType });
        setErrors((prevErrors) => ({
          ...prevErrors,
          propertyTypeError: "",
        }));
      }
    }

    if (name === "projectType") {
      if (selectedId === 2 || selectedId === 3) {
        onChange({
          projectType: {
            id: selectedId,
            name: selectedId === 2 ? "Venta" : "Arriendo",
          },
        });
        setErrors((prevErrors) => ({
          ...prevErrors,
          projectTypeError: "",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          projectTypeError: "Seleccione un tipo de proyecto válido.",
        }));
      }
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
      newErrors.propertyTypeError = "Seleccione el tipo de propiedad.";
    if ((!formData.projectType || !formData.projectType.id) && isProperty)
      newErrors.projectTypeError = "Seleccione la finlaidad de la propiedada";

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
    <div className="container mx-auto max-w-2xl rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        Datos Básicos
      </h2>
      <form onSubmit={handleNext} className="space-y-6">
        <div>
          <label className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary">
            {isProperty ? "Nombre de la propiedad" : "Nombre del proyecto"}
            <span className="-ml-1 text-premium-textPrimary dark:text-premium-textPrimary">
              *
            </span>
            <span className="group relative">
              <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
              <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                <p className="text-xs">
                  {isProperty
                    ? "Nombre de la propiedad que se mostrará al público."
                    : "Nombre del proyecto que se mostrará al público."}
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
            className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
              errors.nameError
                ? "border-red-500"
                : "border-premium-borderColor dark:border-premium-borderColorHover"
            }`}
            placeholder={
              !isProperty
                ? "Ingrese el nombre del proyecto"
                : "Ingrese el nombre de la propiedad"
            }
            required
          />
          {errors.nameError && (
            <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
              <AiOutlineExclamationCircle className="h-4 w-4" />
              {errors.nameError}
            </div>
          )}
        </div>

        <div
          className={`grid grid-cols-1 gap-4 ${
            isProperty ? "sm:grid-cols-2" : ""
          }`}
        >
          <div>
            <label className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary">
              Tipo de propiedad{" "}
              <span className="-ml-1 text-premium-textPrimary dark:text-premium-textPrimary">
                *
              </span>
              <span className="group relative">
                <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                  <p className="text-xs">
                    {isProperty
                      ? "Seleccione el tipo de propiedad que más se ajuste."
                      : "Seleccione el tipo de propiedad que más se ajuste a su proyecto."}
                  </p>
                </div>
              </span>
            </label>
            <select
              name="propertyType"
              value={formData.propertyType?.id || ""}
              onChange={handleSelectChange}
              className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                errors.propertyTypeError
                  ? "border-red-500"
                  : "border-premium-borderColor dark:border-premium-borderColorHover"
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
            {errors.propertyTypeError && (
              <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                <AiOutlineExclamationCircle className="h-4 w-4" />
                {errors.propertyTypeError}
              </div>
            )}
          </div>

          {isProperty && (
            <div>
              <label className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary">
                Finalidad de la propiedad{" "}
                <span className="-ml-1 text-premium-textPrimary dark:text-premium-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="dark:bg-backgroundDark absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:text-premium-textPrimary">
                    <p className="text-xs">
                      Seleccione si la propiedad va estar en venta o en
                      arriendo.
                    </p>
                  </div>
                </span>
              </label>
              <select
                name="projectType"
                value={formData.projectType?.id || ""}
                onChange={handleSelectChange}
                className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                  errors.projectTypeError
                    ? "border-red-500"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
                required
              >
                <option value="">Seleccione una opción</option>
                {[
                  { id: 3, name: "Arriendo" },
                  { id: 3, name: "Venta" },
                ].map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.projectTypeError && (
                <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                  <AiOutlineExclamationCircle className="h-4 w-4" />
                  {errors.projectTypeError}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary">
            Resumen breve{" "}
            <span className="-ml-1 text-premium-textPrimary dark:text-premium-textPrimary">
              *
            </span>
            <span className="group relative">
              <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
              <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                <p className="text-xs">
                  {isProperty
                    ? "Escriba un resumen breve que describa las principales características de la propiedad."
                    : "Escriba un resumen breve que describa las principales características del proyecto."}
                </p>
              </div>
            </span>
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription || ""}
            onChange={handleChange}
            maxLength={150}
            className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
              errors.shortDescriptionError
                ? "border-red-500"
                : "border-premium-borderColor dark:border-premium-borderColorHover"
            }`}
            placeholder="Agregue un resumen breve"
            rows={3}
            required
          />
          {errors.shortDescriptionError && (
            <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
              <AiOutlineExclamationCircle className="h-4 w-4" />
              {errors.shortDescriptionError}
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary">
            Descripción completa{" "}
            <span className="-ml-1 text-premium-textPrimary dark:text-premium-textPrimary">
              *
            </span>
            <span className="group relative">
              <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
              <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                <p className="text-xs">
                  {isProperty
                    ? "Incluya una descripción detallada que explique las características principales de la propiedad."
                    : "Incluya una descripción detallada que explique las características principales del proyecto."}
                </p>
              </div>
            </span>
          </label>
          <textarea
            name="detailedDescription"
            value={formData.detailedDescription || ""}
            onChange={handleChange}
            maxLength={1500}
            className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
              errors.detailedDescriptionError
                ? "border-red-500"
                : "border-premium-borderColor dark:border-premium-borderColorHover"
            }`}
            placeholder="Agregue una descripción completa y detallada"
            rows={6}
            required
          />
          {errors.detailedDescriptionError && (
            <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
              <AiOutlineExclamationCircle className="h-4 w-4" />
              {errors.detailedDescriptionError}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="membershipCheckbox"
            checked={formData.membership === 1004}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-300 text-premium-primary focus:ring-premium-primary"
          />
          <label
            htmlFor="membershipCheckbox"
            className="text-sm text-premium-textPrimary dark:text-premium-textPrimary"
          >
            Propio de la empresa
          </label>
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
