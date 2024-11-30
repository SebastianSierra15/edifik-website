"use client";

import { useState } from "react";
import {
  AiOutlineExclamationCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import StepNavigationButtons from "../../stepNavigationButtons";
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
  });

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

    if (shouldShowField("towers") && !formData.towers)
      newErrors.towersError = "El número de torres es obligatorio.";

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
    if (field === "towers") {
      return propertyTypeId == 1002;
    }
    if (field === "freeHeight") {
      return (
        propertyTypeId === 1004 ||
        propertyTypeId === 1003 ||
        propertyTypeId === 1005
      );
    }
    if (field === "width" || field === "length" || field === "heavyParking") {
      return propertyTypeId === 1005;
    }
    return true;
  };

  return (
    <div className="container mx-auto max-w-2xl p-6 bg-backgroundLight dark:bg-backgroundDark rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary dark:text-primaryLight text-center mb-6">
        Características del Proyecto
      </h2>

      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
              Área Total (m²){" "}
              <span className="text-textPrimary dark:text-textPrimary">*</span>
              <span className="group relative">
                <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                  <p className="text-xs">
                    Ingrese el área total del proyecto en metros cuadrados.
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
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                errors.totalAreaError
                  ? "border-red-500"
                  : "border-borderColor dark:border-borderColorHover"
              }`}
              placeholder="Área total"
              required
            />
            {errors.totalAreaError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.totalAreaError}
              </div>
            )}
          </div>

          <div>
            <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
              Área Construida (m²){" "}
              <span className="text-textPrimary dark:text-textPrimary">*</span>
              <span className="group relative">
                <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                  <p className="text-xs">
                    Ingrese el área construida del proyecto en metros cuadrados,
                    considerando únicamente las áreas cubiertas.
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
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                errors.builtAreaError
                  ? "border-red-500"
                  : "border-borderColor dark:border-borderColorHover"
              }`}
              placeholder="Área construida"
              required
            />
            {errors.builtAreaError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.builtAreaError}
              </div>
            )}
          </div>

          {shouldShowField("bedrooms") && (
            <div>
              <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
                Número de Habitaciones{" "}
                <span className="text-textPrimary dark:text-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                    <p className="text-xs">
                      Especifique cuántas habitaciones tendrá el proyecto. Este
                      campo es obligatorio si aplica.
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
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                  errors.bedroomsError
                    ? "border-red-500"
                    : "border-borderColor dark:border-borderColorHover"
                }`}
                required
              />
              {errors.bedroomsError && (
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-5 h-5" />
                  {errors.bedroomsError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("bathrooms") && (
            <div>
              <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
                Número de Baños{" "}
                <span className="text-textPrimary dark:text-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                    <p className="text-xs">
                      Indique la cantidad total de baños que estarán incluidos
                      en el proyecto.
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
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                  errors.bathroomsError
                    ? "border-red-500"
                    : "border-borderColor dark:border-borderColorHover"
                }`}
                required
              />
              {errors.bathroomsError && (
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-5 h-5" />
                  {errors.bathroomsError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("lobbies") && (
            <div>
              <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
                Número de Salas de Estar{" "}
                <span className="text-textPrimary dark:text-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                    <p className="text-xs">
                      Ingrese el número de salas de estar (salones o lobbies)
                      que tendrá el proyecto.
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
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                  errors.lobbiesError
                    ? "border-red-500"
                    : "border-borderColor dark:border-borderColorHover"
                }`}
                required
              />
              {errors.lobbiesError && (
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-5 h-5" />
                  {errors.lobbiesError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("freeHeight") && (
            <div>
              <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
                Altura Libre (m){" "}
                <span className="text-textPrimary dark:text-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
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
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                  errors.freeHeightError
                    ? "border-red-500"
                    : "border-borderColor dark:border-borderColorHover"
                }`}
                required
              />
              {errors.freeHeightError && (
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-5 h-5" />
                  {errors.freeHeightError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("width") && (
            <div>
              <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
                Ancho (m){" "}
                <span className="text-textPrimary dark:text-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                    <p className="text-xs">
                      Indique el ancho total del proyecto en metros. Este valor
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
                placeholder="Ancho"
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                  errors.widthError
                    ? "border-red-500"
                    : "border-borderColor dark:border-borderColorHover"
                }`}
                required
              />
              {errors.widthError && (
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-5 h-5" />
                  {errors.widthError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("length") && (
            <div>
              <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
                Largo (m){" "}
                <span className="text-textPrimary dark:text-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                    <p className="text-xs">
                      Especifique el largo total del proyecto en metros. Este
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
                placeholder="Largo"
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                  errors.lengthError
                    ? "border-red-500"
                    : "border-borderColor dark:border-borderColorHover"
                }`}
                required
              />
              {errors.lengthError && (
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-5 h-5" />
                  {errors.lengthError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("heavyParking") && (
            <div>
              <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
                Espacios de Parqueo Pesado
                <span className="group relative">
                  <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
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
                className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
              />
            </div>
          )}

          {shouldShowField("towers") && (
            <div>
              <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
                Número de Torres{" "}
                <span className="text-textPrimary dark:text-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                    <p className="text-xs">
                      Ingrese la cantidad de torres que tendrá el proyecto, si
                      corresponde.
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
                placeholder="Número de torres"
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                  errors.towersError
                    ? "border-red-500"
                    : "border-borderColor dark:border-borderColorHover"
                }`}
                required
              />
              {errors.towersError && (
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-5 h-5" />
                  {errors.towersError}
                </div>
              )}
            </div>
          )}

          {shouldShowField("storageUnits") && (
            <div>
              <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
                Depositos
                <span className="group relative">
                  <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                    <p className="text-xs">
                      Especifique el número total de depósitos (bodegas o
                      cuartos de almacenamiento) disponibles en el proyecto.
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
                className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
              />
            </div>
          )}

          {shouldShowField("elevators") && (
            <div>
              <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
                Número de Elevadores
                <span className="group relative">
                  <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                    <p className="text-xs">
                      Indique cuántos elevadores estarán disponibles en el
                      proyecto.
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
                className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
              />
            </div>
          )}

          <div>
            <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
              Espacios de Parqueo
              <span className="group relative">
                <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
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
              className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover"
            />
          </div>
        </div>

        {(formData.propertyType?.id === 1001 ||
          formData.propertyType?.id === 1002) && (
          <div>
            <h3 className="text-lg font-semibold text-center text-primary dark:text-primaryLight mb-4">
              Características Adicionales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shouldShowField("terrace") && (
                <div className="flex items-center justify-between px-3 py-2 border rounded-md bg-secondary-light dark:bg-secondary-dark text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover">
                  <span className="text-textPrimary dark:text-textSecondary">
                    Terraza
                  </span>
                  <input
                    type="checkbox"
                    name="terrace"
                    checked={formData.terrace || false}
                    onChange={(e) => onChange({ terrace: e.target.checked })}
                    className="appearance-none h-6 w-12 bg-textPlaceholder dark:bg-backgroundLight rounded-full relative cursor-pointer transition duration-300 checked:bg-primary after:content-[''] after:h-4 after:w-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-transform checked:after:translate-x-6"
                  />
                </div>
              )}

              {shouldShowField("balcony") && (
                <div className="flex items-center justify-between px-3 py-2 border rounded-md bg-secondary-light dark:bg-secondary-dark text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover">
                  <span className="text-textPrimary dark:text-textSecondary">
                    Balcón
                  </span>
                  <input
                    type="checkbox"
                    name="balcony"
                    checked={formData.balcony || false}
                    onChange={(e) => onChange({ balcony: e.target.checked })}
                    className="appearance-none h-6 w-12 bg-textPlaceholder dark:bg-backgroundLight rounded-full relative cursor-pointer transition duration-300 checked:bg-primary after:content-[''] after:h-4 after:w-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-transform checked:after:translate-x-6"
                  />
                </div>
              )}

              {shouldShowField("garden") && (
                <div className="flex items-center justify-between px-3 py-2 border rounded-md bg-secondary-light dark:bg-secondary-dark text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover">
                  <span className="text-textPrimary dark:text-textSecondary">
                    Jardín
                  </span>
                  <input
                    type="checkbox"
                    name="garden"
                    checked={formData.garden || false}
                    onChange={(e) => onChange({ garden: e.target.checked })}
                    className="appearance-none h-6 w-12 bg-textPlaceholder dark:bg-backgroundLight rounded-full relative cursor-pointer transition duration-300 checked:bg-primary after:content-[''] after:h-4 after:w-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-transform checked:after:translate-x-6"
                  />
                </div>
              )}

              {shouldShowField("laundryArea") && (
                <div className="flex items-center justify-between px-3 py-2 border rounded-md bg-secondary-light dark:bg-secondary-dark text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover">
                  <span className="text-textPrimary dark:text-textSecondary">
                    Área de Lavado
                  </span>
                  <input
                    type="checkbox"
                    name="laundryArea"
                    checked={formData.laundryArea || false}
                    onChange={(e) =>
                      onChange({ laundryArea: e.target.checked })
                    }
                    className="appearance-none h-6 w-12 bg-textPlaceholder dark:bg-backgroundLight rounded-full relative cursor-pointer transition duration-300 checked:bg-primary after:content-[''] after:h-4 after:w-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-transform checked:after:translate-x-6"
                  />
                </div>
              )}

              {shouldShowField("customizationOptions") && (
                <div className="flex items-center justify-between px-3 py-2 border rounded-md bg-secondary-light dark:bg-secondary-dark text-textPrimary dark:text-textPrimary border-borderColor dark:border-borderColorHover">
                  <span className="text-textPrimary dark:text-textSecondary">
                    Opciones de Personalización
                  </span>
                  <input
                    type="checkbox"
                    name="customizationOptions"
                    checked={formData.customizationOptions || false}
                    onChange={(e) =>
                      onChange({ customizationOptions: e.target.checked })
                    }
                    className="appearance-none h-6 w-12 bg-textPlaceholder dark:bg-backgroundLight rounded-full relative cursor-pointer transition duration-300 checked:bg-primary after:content-[''] after:h-4 after:w-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-transform checked:after:translate-x-6"
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
