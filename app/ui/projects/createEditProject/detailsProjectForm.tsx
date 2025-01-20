"use client";

import { useState } from "react";
import StepNavigationButtons from "../../admin/stepNavigationButtons";
import {
  CommonArea,
  NearbyService,
  HousingType,
  ProjectData,
} from "@/lib/definitios";
import {
  AiOutlineClose,
  AiOutlineExclamationCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import DatePicker from "react-datepicker";
import { formatNumber } from "@/utils/formatters";
import "react-datepicker/dist/react-datepicker.css";

type DetailsProjectFormProps = {
  formData: ProjectData;
  onChange: (updatedData: Partial<ProjectData>) => void;
  onSubmit: (data: Partial<ProjectData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  commonAreas: CommonArea[];
  nearbyServices: NearbyService[];
  housingTypes: HousingType[];
};

export default function DetailsProjectForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  commonAreas,
  nearbyServices,
  housingTypes,
}: DetailsProjectFormProps) {
  const [errors, setErrors] = useState({
    priceError: "",
    housingTypeError: "",
    availableUnitsError: "",
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = value ? parseInt(value, 10) : 0;

    onChange({ price: numericValue });
    if (numericValue > 0) {
      setErrors((prev) => ({ ...prev, priceError: "" }));
    }
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [e.target.name]: e.target.value });
    setErrors({ ...errors, [`${e.target.name}Error`]: "" });
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

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange({ availableDate: date });
      setErrors((prev) => ({ ...prev, dateError: "" }));
    }
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    type: "commonAreas" | "nearbyServices" | "housingType",
  ) => {
    const id = parseInt(e.target.value);

    if (type === "housingType") {
      const selectedHousingType = housingTypes.find((type) => type.id === id);
      onChange({ housingType: selectedHousingType });

      if (selectedHousingType) {
        setErrors((prevErrors) => ({ ...prevErrors, housingTypeError: "" }));
      }
    } else {
      const selectedItem =
        type === "commonAreas"
          ? commonAreas.find((area) => area.id === id)
          : nearbyServices.find((service) => service.id === id);

      if (selectedItem) {
        const updatedItems = [...(formData[type] || []), selectedItem];

        onChange({ [type]: updatedItems });
      }
    }
  };

  const handleRemoveTag = (
    id: number,
    type: "commonAreas" | "nearbyServices",
  ) => {
    const updatedItems = formData[type]?.filter((item) => item.id !== id) || [];
    onChange({ [type]: updatedItems });
  };

  const validateForm = () => {
    const newErrors = { ...errors };

    if (!formData.price) {
      newErrors.priceError = "El precio es obligatorio y debe ser mayor que 0.";
    }

    if (!formData.availableUnits && formData.projectType?.id === 1) {
      newErrors.availableUnitsError =
        "La cantidad de unidades disponibles es obligatoria";
    }

    if (
      (formData.propertyType?.id === 1001 ||
        formData.propertyType?.id === 1002) &&
      !formData.housingType
    )
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
    <div className="container mx-auto max-w-2xl rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {formData.projectType?.id === 1
          ? "Detalles del Proyecto"
          : "Detalles de la Propiedad"}
      </h2>

      <form onSubmit={handleNext} className="space-y-6">
        <div
          className={`grid grid-cols-1 gap-4 ${
            formData.projectType?.id === 1 ? "sm:grid-cols-2" : ""
          }`}
        >
          <div className="w-full">
            <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
              Precio
              <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                *
              </span>
              <span className="group relative">
                <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                  <p className="text-xs">
                    {formData.projectType?.id === 2 ||
                    formData.projectType?.id === 3
                      ? "Indique el precio de la propiedad."
                      : "Indique el precio por unidad del proyecto."}
                  </p>
                </div>
              </span>
            </label>
            <input
              type="text"
              name="price"
              value={formData.price ? formatNumber(formData.price) : ""}
              onChange={handlePriceChange}
              className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight ${
                errors.priceError
                  ? "border-red-500"
                  : "border-premium-borderColor dark:border-premium-borderColorHover"
              }`}
              placeholder="Ingrese el precio"
              required
            />
            {errors.priceError && (
              <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                <AiOutlineExclamationCircle className="h-4 w-4" />
                {errors.priceError}
              </div>
            )}
          </div>

          {formData.projectType?.id === 1 && (
            <div>
              <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                Unidades Disponibles
                <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">
                      Especifique el número de unidades disponibles para este
                      proyecto.
                    </p>
                  </div>
                </span>
              </label>
              <input
                type="number"
                name="availableUnits"
                min={0}
                value={formData.availableUnits || ""}
                onChange={handleChange}
                className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight ${
                  errors.availableUnitsError
                    ? "border-red-500"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
                placeholder="Número de unidades disponibles"
              />
              {errors.availableUnitsError && (
                <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                  <AiOutlineExclamationCircle className="h-4 w-4" />
                  {errors.availableUnitsError}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className={`grid grid-cols-1 gap-4 ${
            formData.propertyType?.id === 1001 ||
            formData.propertyType?.id === 1002
              ? "sm:grid-cols-2"
              : ""
          }`}
        >
          {(formData.propertyType?.id === 1001 ||
            formData.propertyType?.id === 1002) && (
            <div>
              <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
                Tipo de Vivienda
                <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">Seleccione el tipo de vivienda.</p>
                  </div>
                </span>
              </label>
              <select
                name="housingType"
                value={formData.housingType?.id || ""}
                className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                  errors.housingTypeError
                    ? "border-red-500"
                    : "border-premium-borderColor dark:border-premium-borderColorHover"
                }`}
                onChange={(e) => handleSelectChange(e, "housingType")}
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
                <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                  <AiOutlineExclamationCircle className="h-4 w-4" />
                  {errors.housingTypeError}
                </div>
              )}
            </div>
          )}

          <div className="w-full">
            <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
              Fecha Estimada de Entrega
              <span className="group relative">
                <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                  <p className="text-xs">
                    Seleccione la fecha estimada para la entrega del proyecto
                    (mes/año).
                  </p>
                </div>
              </span>
            </label>
            <DatePicker
              selected={formData.availableDate}
              onChange={handleDateChange}
              showMonthYearPicker
              minDate={new Date()}
              dateFormat="MM/yyyy"
              placeholderText="mm/yyyy"
              className="w-full rounded-md border border-premium-borderColor bg-premium-background px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-backgroundLight"
              wrapperClassName="w-full"
            />
          </div>
        </div>

        {formData.propertyType?.id === 1002 &&
          (formData.projectType?.id === 2 ||
            formData.projectType?.id === 3) && (
            <div>
              <label className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary">
                Nombre del conjunto
                <span className="group relative">
                  <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                    <p className="text-xs">
                      Nombre del conjunto residencial (si aplica).
                    </p>
                  </div>
                </span>
              </label>
              <input
                type="text"
                name="complexName"
                value={formData.complexName || ""}
                onChange={handleChangeText}
                maxLength={100}
                className="w-full rounded-md border border-premium-borderColor bg-premium-background px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-backgroundLight dark:text-premium-textPrimary"
                placeholder="Ingrese el nombre del proyecto"
              />
            </div>
          )}

        <div>
          <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
            Áreas Comunes
            <span className="group relative">
              <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
              <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                <p className="text-xs">
                  {formData.projectType?.id === 2 ||
                  formData.projectType?.id === 3
                    ? "Seleccione las áreas comunes disponibles en la propiedad."
                    : "Seleccione las áreas comunes disponibles en el proyecto."}
                </p>
              </div>
            </span>
          </label>
          <select
            onChange={(e) => handleSelectChange(e, "commonAreas")}
            className="w-full rounded-md border border-premium-borderColor bg-premium-background px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-backgroundLight"
          >
            <option value="">Seleccione un área común</option>
            {commonAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
          <div className="mt-2 flex flex-wrap">
            {formData.commonAreas?.map((area) => (
              <div
                key={area.id}
                className="m-1 flex items-center rounded-full bg-premium-primary px-3 py-1 text-white dark:bg-premium-primaryLight"
              >
                {area.name}
                <button
                  className="ml-2 text-white hover:text-premium-textPrimary"
                  onClick={() => handleRemoveTag(area.id, "commonAreas")}
                >
                  <AiOutlineClose className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
            Servicios Cercanos
            <span className="group relative">
              <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
              <div className="absolute z-10 mt-2 hidden w-64 flex-col items-center rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:flex dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                <p className="text-xs">
                  {formData.projectType?.id === 2 ||
                  formData.projectType?.id === 3
                    ? "Seleccione los servicios cercanos a la propiedad."
                    : "Seleccione los servicios cercanos al proyecto."}
                </p>
              </div>
            </span>
          </label>
          <select
            onChange={(e) => handleSelectChange(e, "nearbyServices")}
            className="w-full rounded-md border border-premium-borderColor bg-premium-background px-3 py-2 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-backgroundLight"
          >
            <option value="">Seleccione un servicio cercano</option>
            {nearbyServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          <div className="mt-2 flex flex-wrap">
            {formData.nearbyServices?.map((service) => (
              <div
                key={service.id}
                className="m-1 flex items-center rounded-full bg-premium-primary px-3 py-1 text-white dark:bg-premium-primaryLight"
              >
                {service.name}
                <button
                  className="ml-2 text-white hover:text-premium-textPrimary"
                  onClick={() => handleRemoveTag(service.id, "nearbyServices")}
                >
                  <AiOutlineClose className="h-4 w-4" />
                </button>
              </div>
            ))}
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
