"use client";

import { useState } from "react";
import {
  AiOutlineExclamationCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import StepNavigationButtons from "../../admin/stepNavigationButtons";
import { ProjectData } from "@/lib/definitios";

type FeaturesProjectFormProps = {
  formData: ProjectData;
  onChange: (updatedData: Partial<ProjectData>) => void;
  onSubmit: (data: Partial<ProjectData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
};

export default function FeaturesProjectForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
}: FeaturesProjectFormProps) {
  const [errors, setErrors] = useState({
    builtAreaError: "",
    totalAreaError: "",
    housingTypeError: "",
    bathroomsError: "",
    bedroomsError: "",
    lobbiesError: "",
    freeHeightError: "",
    widthError: "",
    lengthError: "",
    towersError: "",
    socioeconomicLevelError: "",
    yearBuiltError: "",
  });

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    const selectedValue = parseInt(value);

    onChange({ [name]: selectedValue });

    if (!isNaN(selectedValue)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${name}Error`]: "",
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    const updatedValue =
      type === "number" ? (value === "" ? "" : parseFloat(value)) : value;

    onChange({ [name]: updatedValue });

    if (value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${name}Error`]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = { ...errors };

    if (!formData.builtArea)
      newErrors.builtAreaError = "El área construida es obligatoria.";

    if (!formData.totalArea)
      newErrors.totalAreaError = "El área total es obligatoria.";

    if (shouldShowField("bathrooms") && !formData.bathrooms)
      newErrors.bathroomsError = "El número de baños es obligatorio.";

    if (shouldShowField("bedrooms") && !formData.bedrooms)
      newErrors.bedroomsError = "El número de habitaciones es obligatorio.";

    if (shouldShowField("lobbies") && !formData.lobbies)
      newErrors.lobbiesError = "El número de salas de estar es obligatorio.";

    if (shouldShowField("freeHeight") && !formData.freeHeight)
      newErrors.freeHeightError = "La altura libre es obligatoria.";

    if (shouldShowField("width") && !formData.width)
      newErrors.widthError = "El ancho es obligatorio.";

    if (shouldShowField("length") && !formData.length)
      newErrors.lengthError = "El largo es obligatorio.";

    if (
      shouldShowField("towers") &&
      !formData.towers &&
      formData.projectType?.id === 1
    )
      newErrors.towersError = "El número de torres es obligatorio.";

    if (
      shouldShowField("socioeconomicLevel") &&
      !formData.socioeconomicLevel &&
      (formData.projectType?.id === 2 || formData.projectType?.id === 3)
    )
      newErrors.socioeconomicLevelError = "El estrato es obligatorio";

    if (
      shouldShowField("yearBuilt") &&
      !formData.yearBuilt &&
      (formData.projectType?.id === 2 || formData.projectType?.id === 3)
    )
      newErrors.yearBuiltError = "El año de contrucción es obligatorio";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const shouldShowField = (field: string) => {
    const propertyTypeId = formData.propertyType?.id;

    if (
      field === "socioecnomicLevel" ||
      field === "yearBuilt" ||
      field === "bedrooms" ||
      field === "storageUnits" ||
      field === "balcony" ||
      field === "laundryArea" ||
      field === "customizationOptions"
    ) {
      return propertyTypeId === 1001 || propertyTypeId === 1002;
    }
    if (field === "terrace" || field === "garden") {
      return propertyTypeId === 1001;
    }
    if (field === "bathrooms" || field === "lobbies") {
      return (
        propertyTypeId === 1001 ||
        propertyTypeId === 1002 ||
        propertyTypeId === 1004
      );
    }
    if (field === "elevators") {
      return (
        propertyTypeId === 1002 ||
        propertyTypeId === 1003 ||
        propertyTypeId === 1004
      );
    }
    if (field === "towers" || field === "floorNumber") {
      return propertyTypeId == 1002;
    }
    if (field === "freeHeight") {
      return (
        propertyTypeId === 1004 ||
        propertyTypeId === 1003 ||
        propertyTypeId === 1005
      );
    }
    if (field === "width" || field === "length") {
      return (
        propertyTypeId === 1005 ||
        propertyTypeId === 1006 ||
        propertyTypeId === 1007
      );
    }
    if (field === "heavyParking") {
      return propertyTypeId === 1005;
    }
    return true;
  };

  return (
    <div className="container mx-auto max-w-2xl rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {formData.projectType?.id === 1
          ? "Características del Proyecto"
          : "Características de la Propiedad"}
      </h2>

      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
              Área Total (m²){" "}
              <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                *
              </span>
              <span className="group relative">
                <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                  <p className="text-xs">
                    {formData.projectType?.id === 2 ||
                    formData.projectType?.id === 3
                      ? "Ingrese el área total de la propiedad en metros cuadrados."
                      : "Ingrese el área total del proyecto en metros cuadrados."}
                  </p>
                </div>
              </span>
            </label>
            <input
              type="number"
              name="totalArea"
              min={0}
              value={formData.totalArea || ""}
              onChange={handleChange}
              className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                errors.totalAreaError
                  ? "border-red-500"
                  : "border-premium-borderColor dark:border-premium-borderColorHover"
              }`}
              placeholder="Área total"
              required
            />
            {errors.totalAreaError && (
              <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                <AiOutlineExclamationCircle className="h-5 w-5" />
                {errors.totalAreaError}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
              Área Construida (m²){" "}
              <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                *
              </span>
              <span className="group relative">
                <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                  <p className="text-xs">
                    {formData.projectType?.id === 2 ||
                    formData.projectType?.id === 3
                      ? "Ingrese el área construida de la propiedad en metros cuadrados, considerando únicamente las áreas cubiertas."
                      : "Ingrese el área construida del proyecto en metros cuadrados, considerando únicamente las áreas cubiertas."}
                  </p>
                </div>
              </span>
            </label>
            <input
              type="number"
              name="builtArea"
              min={0}
              value={formData.builtArea || ""}
              onChange={handleChange}
              className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                errors.builtAreaError
                  ? "border-red-500"
                  : "border-premium-borderColor dark:border-premium-borderColorHover"
              }`}
              placeholder="Área construida"
              required
            />
            {errors.builtAreaError && (
              <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                <AiOutlineExclamationCircle className="h-5 w-5" />
                {errors.builtAreaError}
              </div>
            )}
          </div>

          {shouldShowField("socioeconomicLevel") &&
            (formData.projectType?.id === 2 ||
              formData.projectType?.id === 3) && (
              <div>
                <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                  Nivel Socioeconómico{" "}
                  <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                    *
                  </span>
                  <span className="group relative">
                    <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                    <div className="absolute z-10 mt-2 hidden w-64 rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:block dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                      <p className="text-xs">
                        Seleccione el nivel socioeconómico asignado a la
                        propiedad según la clasificación oficial del sector.
                      </p>
                    </div>
                  </span>
                </label>
                <select
                  name="socioeconomicLevel"
                  value={formData.socioeconomicLevel || ""}
                  onChange={handleSelectChange}
                  className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                    errors.socioeconomicLevelError
                      ? "border-red-500"
                      : "border-premium-borderColor"
                  }`}
                >
                  <option value="" disabled>
                    Seleccione un nivel
                  </option>
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <option key={level} value={level}>
                      Estrato {level}
                    </option>
                  ))}
                </select>
                {errors.socioeconomicLevelError && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                    <AiOutlineExclamationCircle className="h-5 w-5" />
                    {errors.socioeconomicLevelError}
                  </div>
                )}
              </div>
            )}

          {shouldShowField("yearBuilt") &&
            (formData.projectType?.id === 2 ||
              formData.projectType?.id === 3) && (
              <div>
                <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                  Año de Contrucción{" "}
                  <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                    *
                  </span>
                  <span className="group relative">
                    <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                    <div className="absolute z-10 mt-2 hidden w-64 rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:block dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                      <p className="text-xs">
                        Seleccione el año en que la propiedad fue construida o
                        su estructura original terminada.
                      </p>
                    </div>
                  </span>
                </label>
                <select
                  name="yearBuilt"
                  value={formData.yearBuilt || ""}
                  onChange={handleSelectChange}
                  className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                    errors.yearBuiltError
                      ? "border-red-500"
                      : "border-premium-borderColor"
                  }`}
                >
                  <option value="" disabled>
                    Seleccione el año
                  </option>
                  {Array.from(
                    { length: new Date().getFullYear() - 1950 + 1 },
                    (_, i) => 1950 + i,
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.yearBuiltError && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                    <AiOutlineExclamationCircle className="h-5 w-5" />
                    {errors.yearBuiltError}
                  </div>
                )}
              </div>
            )}

          {shouldShowField("bedrooms") && (
            <div>
              <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                Número de Habitaciones{" "}
                <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">
                      {formData.projectType?.id === 2 ||
                      formData.projectType?.id === 3
                        ? "Especifique cuántas habitaciones tiene la propiedad."
                        : "Especifique cuántas habitaciones tendrá el proyecto."}
                    </p>
                  </div>
                </span>
              </label>
              <input
                type="number"
                name="bedrooms"
                min={0}
                value={formData.bedrooms || ""}
                onChange={handleChange}
                placeholder="Número de habitaciones"
                className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                  errors.bedroomsError
                    ? "border-red-500"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
                required
              />
              {errors.bedroomsError && (
                <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                  <AiOutlineExclamationCircle className="h-5 w-5" />
                  {errors.bedroomsError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("bathrooms") && (
            <div>
              <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                Número de Baños{" "}
                <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">
                      {formData.projectType?.id === 2 ||
                      formData.projectType?.id === 3
                        ? "Indique la cantidad total de baños que tiene la propiedad."
                        : "Indique la cantidad total de baños que estarán incluidos en el proyecto."}
                    </p>
                  </div>
                </span>
              </label>
              <input
                type="number"
                name="bathrooms"
                min={0}
                value={formData.bathrooms || ""}
                onChange={handleChange}
                placeholder="Número de baños"
                className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                  errors.bathroomsError
                    ? "border-red-500"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
                required
              />
              {errors.bathroomsError && (
                <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                  <AiOutlineExclamationCircle className="h-5 w-5" />
                  {errors.bathroomsError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("lobbies") && (
            <div>
              <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                Número de Salas de Estar{" "}
                <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">
                      {formData.projectType?.id === 2 ||
                      formData.projectType?.id === 3
                        ? "Ingrese el número de salas de estar (salones o lobbies) que tiene la propiedad."
                        : "Ingrese el número de salas de estar (salones o lobbies) que tendrá el proyecto."}
                    </p>
                  </div>
                </span>
              </label>
              <input
                type="number"
                name="lobbies"
                min={0}
                value={formData.lobbies || ""}
                onChange={handleChange}
                placeholder="Número de salas de estar"
                className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                  errors.lobbiesError
                    ? "border-red-500"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
                required
              />
              {errors.lobbiesError && (
                <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                  <AiOutlineExclamationCircle className="h-5 w-5" />
                  {errors.lobbiesError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("freeHeight") && (
            <div>
              <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                Altura Libre (m){" "}
                <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">
                      Especifique la altura libre del proyecto en metros,
                      considerando el espacio disponible entre el suelo y el
                      techo.
                    </p>
                  </div>
                </span>
              </label>
              <input
                type="number"
                name="freeHeight"
                min={0}
                value={formData.freeHeight || ""}
                onChange={handleChange}
                placeholder="Altura libre"
                className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                  errors.freeHeightError
                    ? "border-red-500"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
                required
              />
              {errors.freeHeightError && (
                <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                  <AiOutlineExclamationCircle className="h-5 w-5" />
                  {errors.freeHeightError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("width") && (
            <div>
              <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                Frente (m){" "}
                <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">
                      Indique el frente total del proyecto en metros. Este valor
                      corresponde a la dimensión horizontal.
                    </p>
                  </div>
                </span>
              </label>
              <input
                type="number"
                name="width"
                min={0}
                value={formData.width || ""}
                onChange={handleChange}
                placeholder="Medida del frente"
                className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                  errors.widthError
                    ? "border-red-500"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
                required
              />
              {errors.widthError && (
                <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                  <AiOutlineExclamationCircle className="h-5 w-5" />
                  {errors.widthError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("length") && (
            <div>
              <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                Fondo (m){" "}
                <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">
                      Especifique el fondo total del proyecto en metros. Este
                      valor corresponde a la dimensión vertical.
                    </p>
                  </div>
                </span>
              </label>
              <input
                type="number"
                name="length"
                min={0}
                value={formData.length || ""}
                onChange={handleChange}
                placeholder="Medida del fondo"
                className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                  errors.lengthError
                    ? "border-red-500"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
                required
              />
              {errors.lengthError && (
                <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                  <AiOutlineExclamationCircle className="h-5 w-5" />
                  {errors.lengthError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("heavyParking") && (
            <div>
              <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                {formData.propertyType?.id === 1005
                  ? "Espacios de Parqueo Privado"
                  : "Espacios de Parqueo Pesado"}
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">
                      Indique cuántos espacios de parqueo estarán disponibles
                      para vehículos pesados.
                    </p>
                  </div>
                </span>
              </label>
              <input
                type="number"
                name="heavyParking"
                min={0}
                value={formData.heavyParking || ""}
                onChange={handleChange}
                placeholder="Número de parqueos para vehículos pesados"
                className="w-full rounded-md border border-premium-borderColor bg-premium-background px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-backgroundLight dark:text-premium-textPrimary"
              />
            </div>
          )}

          {shouldShowField("towers") && (
            <div>
              <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                {formData.projectType?.id === 2 ||
                formData.projectType?.id === 3
                  ? "Número de Torre"
                  : "Número de Torres *"}
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">
                      {formData.projectType?.id === 2 ||
                      formData.projectType?.id === 3
                        ? "Indique la torre en la que se encuentra la propiedad (si aplica)."
                        : "Ingrese la cantidad de torres que tendrá el proyecto, si corresponde."}
                    </p>
                  </div>
                </span>
              </label>
              <input
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
                className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                  errors.towersError && formData.projectType?.id === 1
                    ? "border-red-500"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
                required={formData.projectType?.id === 1}
              />
              {errors.towersError && formData.projectType?.id === 1 && (
                <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                  <AiOutlineExclamationCircle className="h-5 w-5" />
                  {errors.towersError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("floorNumber") &&
            (formData.projectType?.id === 2 ||
              formData.projectType?.id === 3) && (
              <div>
                <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                  Número de Piso
                  <span className="group relative">
                    <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                    <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                      <p className="text-xs">
                        Ingrese el número de piso donde se encuentra el
                        apartamento. Por ejemplo, '3' para el tercer piso.
                      </p>
                    </div>
                  </span>
                </label>
                <input
                  type="number"
                  name="floorNumber"
                  min={0}
                  value={formData.floorNumber || ""}
                  onChange={handleChange}
                  placeholder="Número de piso"
                  className="w-full rounded-md border border-premium-borderColor bg-premium-background px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-backgroundLight dark:text-premium-textPrimary"
                />
              </div>
            )}

          {shouldShowField("storageUnits") && (
            <div>
              <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                Depositos
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">
                      {formData.projectType?.id === 2 ||
                      formData.projectType?.id === 3
                        ? "Especifique el número total de depósitos (bodegas o cuartos de almacenamiento) disponibles para la propiedad."
                        : "Especifique el número total de depósitos (bodegas o cuartos de almacenamiento) disponibles en el proyecto."}
                    </p>
                  </div>
                </span>
              </label>
              <input
                type="number"
                name="storageUnits"
                min={0}
                value={formData.storageUnits || ""}
                onChange={handleChange}
                placeholder="Número de depositos"
                className="w-full rounded-md border border-premium-borderColor bg-premium-background px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-backgroundLight dark:text-premium-textPrimary"
              />
            </div>
          )}

          {shouldShowField("elevators") && (
            <div>
              <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                Número de Elevadores
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">
                      {formData.projectType?.id === 2 ||
                      formData.projectType?.id === 3
                        ? "Indique cuántos elevadores estarán disponibles para la propiedad."
                        : "Indique cuántos elevadores estarán disponibles en el proyecto."}
                    </p>
                  </div>
                </span>
              </label>
              <input
                type="number"
                name="elevators"
                min={0}
                value={formData.elevators || ""}
                onChange={handleChange}
                placeholder="Número de elevadores"
                className="w-full rounded-md border border-premium-borderColor bg-premium-background px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-backgroundLight dark:text-premium-textPrimary"
              />
            </div>
          )}

          <div>
            <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
              {formData.propertyType?.id === 1005
                ? "Espacios de Parqueo Sociales"
                : "Espacios de Parqueo"}
              <span className="group relative">
                <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                  <p className="text-xs">
                    Especifique el número total de espacios de parqueo que
                    estarán disponibles.
                  </p>
                </div>
              </span>
            </label>
            <input
              type="number"
              name="parkingSpots"
              min={0}
              value={formData.parkingSpots || ""}
              onChange={handleChange}
              placeholder="Número de espacios de parqueo"
              className="w-full rounded-md border border-premium-borderColor bg-premium-background px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-backgroundLight dark:text-premium-textPrimary"
            />
          </div>
        </div>

        {(formData.propertyType?.id === 1001 ||
          formData.propertyType?.id === 1002) && (
          <div>
            <h3 className="mb-4 text-center text-lg font-semibold text-premium-primary dark:text-premium-primaryLight">
              Características Adicionales
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {shouldShowField("terrace") && (
                <div className="flex items-center justify-between rounded-md border border-premium-borderColor bg-premium-secondaryLight px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-secondaryDark dark:text-premium-textPrimary">
                  <span className="text-premium-textPrimary dark:text-premium-textSecondary">
                    Terraza
                  </span>
                  <input
                    type="checkbox"
                    name="terrace"
                    checked={formData.terrace || false}
                    onChange={(e) => onChange({ terrace: e.target.checked })}
                    className="relative h-6 w-12 cursor-pointer appearance-none rounded-full bg-premium-textPlaceholder transition duration-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] checked:bg-premium-primary checked:after:translate-x-6 dark:bg-premium-backgroundLight"
                  />
                </div>
              )}

              {shouldShowField("balcony") && (
                <div className="bg-secondary-light dark:bg-secondary-dark flex items-center justify-between rounded-md border border-premium-borderColor px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:text-premium-textPrimary">
                  <span className="text-premium-textPrimary dark:text-premium-textSecondary">
                    Balcón
                  </span>
                  <input
                    type="checkbox"
                    name="balcony"
                    checked={formData.balcony || false}
                    onChange={(e) => onChange({ balcony: e.target.checked })}
                    className="relative h-6 w-12 cursor-pointer appearance-none rounded-full bg-premium-textPlaceholder transition duration-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] checked:bg-premium-primary checked:after:translate-x-6 dark:bg-premium-backgroundLight"
                  />
                </div>
              )}

              {shouldShowField("garden") && (
                <div className="bg-secondary-light dark:bg-secondary-dark flex items-center justify-between rounded-md border border-premium-borderColor px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:text-premium-textPrimary">
                  <span className="text-premium-textPrimary dark:text-premium-textSecondary">
                    Jardín
                  </span>
                  <input
                    type="checkbox"
                    name="garden"
                    checked={formData.garden || false}
                    onChange={(e) => onChange({ garden: e.target.checked })}
                    className="relative h-6 w-12 cursor-pointer appearance-none rounded-full bg-premium-textPlaceholder transition duration-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] checked:bg-premium-primary checked:after:translate-x-6 dark:bg-premium-backgroundLight"
                  />
                </div>
              )}

              {shouldShowField("laundryArea") && (
                <div className="bg-secondary-light dark:bg-secondary-dark flex items-center justify-between rounded-md border border-premium-borderColor px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:text-premium-textPrimary">
                  <span className="text-premium-textPrimary dark:text-premium-textSecondary">
                    Área de Lavado
                  </span>
                  <input
                    type="checkbox"
                    name="laundryArea"
                    checked={formData.laundryArea || false}
                    onChange={(e) =>
                      onChange({ laundryArea: e.target.checked })
                    }
                    className="relative h-6 w-12 cursor-pointer appearance-none rounded-full bg-premium-textPlaceholder transition duration-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] checked:bg-premium-primary checked:after:translate-x-6 dark:bg-premium-backgroundLight"
                  />
                </div>
              )}

              {shouldShowField("customizationOptions") &&
                (formData.projectType?.id === 2 ||
                  formData.projectType?.id === 3) && (
                  <div className="bg-secondary-light dark:bg-secondary-dark flex items-center justify-between rounded-md border border-premium-borderColor px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:text-premium-textPrimary">
                    <span className="text-premium-textPrimary dark:text-premium-textSecondary">
                      Opciones de Personalización
                    </span>
                    <input
                      type="checkbox"
                      name="customizationOptions"
                      checked={formData.customizationOptions || false}
                      onChange={(e) =>
                        onChange({ customizationOptions: e.target.checked })
                      }
                      className="relative h-6 w-12 cursor-pointer appearance-none rounded-full bg-premium-textPlaceholder transition duration-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] checked:bg-premium-primary checked:after:translate-x-6 dark:bg-premium-backgroundLight"
                    />
                  </div>
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
