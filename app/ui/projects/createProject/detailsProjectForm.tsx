"use client";

import { useState } from "react";
import StepNavigationButtons from "../../stepNavigationButtons";
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange({ availableDate: date });
      setErrors((prev) => ({ ...prev, dateError: "" }));
    }
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    type: "commonAreas" | "nearbyServices" | "housingType"
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
    type: "commonAreas" | "nearbyServices"
  ) => {
    const updatedItems = formData[type]?.filter((item) => item.id !== id) || [];
    onChange({ [type]: updatedItems });
  };

  const validateForm = () => {
    const newErrors = { ...errors };

    if (!formData.price) {
      newErrors.priceError = "El precio es obligatorio y debe ser mayor que 0.";
    }

    if (!formData.availableUnits) {
      newErrors.availableUnitsError =
        "La cantidad de unidades disponibles es obligatoria";
    }

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
        Detalles del Proyecto
      </h2>

      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full">
            <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
              Precio
              <span className="text-textPrimary dark:text-textPrimary">*</span>
              <span className="group relative">
                <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                  <p className="text-xs">
                    Indique el precio por unidad del proyecto.
                  </p>
                </div>
              </span>
            </label>
            <input
              type="text"
              name="price"
              value={formData.price ? formatPrice(formData.price) : ""}
              onChange={handlePriceChange}
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary ${
                errors.priceError
                  ? "border-red-500"
                  : "border-borderColor dark:border-borderColorHover"
              }`}
              placeholder="Ingrese el precio"
              required
            />
            {errors.priceError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-4 h-4" />
                {errors.priceError}
              </div>
            )}
          </div>

          <div>
            <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
              Unidades Disponibles
              <span className="text-textPrimary dark:text-textPrimary">*</span>
              <span className="group relative">
                <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
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
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary ${
                errors.availableUnitsError
                  ? "border-red-500"
                  : "border-borderColor dark:border-borderColorHover"
              }`}
              placeholder="Número de unidades disponibles"
            />
            {errors.availableUnitsError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-4 h-4" />
                {errors.availableUnitsError}
              </div>
            )}
          </div>
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
              <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
                Tipo de Vivienda
                <span className="text-textPrimary dark:text-textPrimary">
                  *
                </span>
                <span className="group relative">
                  <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                  <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                    <p className="text-xs">Seleccione el tipo de vivienda.</p>
                  </div>
                </span>
              </label>
              <select
                name="housingType"
                value={formData.housingType?.id || ""}
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                  errors.housingTypeError
                    ? "border-red-500"
                    : "border-borderColor dark:border-borderColorHover"
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
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-4 h-4" />
                  {errors.housingTypeError}
                </div>
              )}
            </div>
          )}

          <div className="w-full">
            <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
              Fecha Estimada de Entrega
              <span className="group relative">
                <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
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
              className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary border-borderColor dark:border-borderColorHover"
              wrapperClassName="w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
            Áreas Comunes
            <span className="group relative">
              <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
              <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                <p className="text-xs">
                  Seleccione las áreas comunes disponibles en el proyecto.
                </p>
              </div>
            </span>
          </label>
          <select
            onChange={(e) => handleSelectChange(e, "commonAreas")}
            className="w-full px-3 py-2 border rounded-md bg-background border-borderColor dark:border-borderColorHover dark:bg-backgroundLight text-textPrimary"
          >
            <option value="">Seleccione un área común</option>
            {commonAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap mt-2">
            {formData.commonAreas?.map((area) => (
              <div
                key={area.id}
                className="bg-primary dark:bg-primaryLight text-white px-3 py-1 m-1 rounded-full flex items-center"
              >
                {area.name}
                <button
                  className="ml-2 text-white hover:text-textPrimary"
                  onClick={() => handleRemoveTag(area.id, "commonAreas")}
                >
                  <AiOutlineClose className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="ext-textPrimary dark:text-textPrimary mb-2 flex items-center gap-1">
            Servicios Cercanos
            <span className="group relative">
              <AiOutlineInfoCircle className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400" />
              <div className="absolute hidden group-hover:flex flex-col items-center bg-backgroundLight dark:bg-backgroundDark text-textPrimary dark:text-textPrimary border border-borderColor dark:border-borderColorHover rounded-md shadow-md p-2 w-64 mt-2 z-10">
                <p className="text-xs">
                  Seleccione los servicios cercanos al proyecto.
                </p>
              </div>
            </span>
          </label>
          <select
            onChange={(e) => handleSelectChange(e, "nearbyServices")}
            className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary border-borderColor dark:border-borderColorHover"
          >
            <option value="">Seleccione un servicio cercano</option>
            {nearbyServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap mt-2">
            {formData.nearbyServices?.map((service) => (
              <div
                key={service.id}
                className="bg-primary dark:bg-primaryLight text-white px-3 py-1 m-1 rounded-full flex items-center"
              >
                {service.name}
                <button
                  className="ml-2 text-white hover:text-textPrimary"
                  onClick={() => handleRemoveTag(service.id, "nearbyServices")}
                >
                  <AiOutlineClose className="w-4 h-4" />
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
