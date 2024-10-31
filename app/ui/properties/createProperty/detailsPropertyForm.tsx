"use client";

import { useState } from "react";
import StepNavigationButtons from "../../stepNavigationButtons";
import { CommonArea, NearbyService, PropertyData } from "@/lib/definitios";
import { AiOutlineClose, AiOutlineExclamationCircle } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DetailsPropertyFormProps = {
  formData: PropertyData;
  onChange: (updatedData: Partial<PropertyData>) => void;
  onSubmit: (data: Partial<PropertyData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  commonAreas: CommonArea[];
  nearbyServices: NearbyService[];
};

export default function DetailsPropertyForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  commonAreas,
  nearbyServices,
}: DetailsPropertyFormProps) {
  const [errors, setErrors] = useState({
    priceError: "",
    dateError: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
    if (name === "price" && parseFloat(value) > 0) {
      setErrors((prev) => ({ ...prev, priceError: "" }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange({ availabeDate: date });
      setErrors((prev) => ({ ...prev, dateError: "" }));
    }
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    type: "commonAreas" | "nearbyService"
  ) => {
    const id = parseInt(e.target.value);
    const selectedItem =
      type === "commonAreas"
        ? commonAreas.find((area) => area.id === id)
        : nearbyServices.find((service) => service.id === id);

    if (selectedItem) {
      const updatedItems = [...(formData[type] || []), selectedItem];

      onChange({ [type]: updatedItems });
    }
  };

  const handleRemoveTag = (
    id: number,
    type: "commonAreas" | "nearbyService"
  ) => {
    const updatedItems = formData[type]?.filter((item) => item.id !== id) || [];
    onChange({ [type]: updatedItems });
  };

  const validateForm = () => {
    const newErrors = { ...errors };

    if (!formData.price) {
      newErrors.priceError = "El precio es obligatorio y debe ser mayor que 0.";
    }

    if (formData.category?.id === 1003 && !formData.availabeDate) {
      newErrors.dateError = "La fecha estimada de entrega es obligatoria.";
    }

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
        Detalles de la Propiedad
      </h2>

      <form onSubmit={handleNext} className="space-y-6">
        <div
          className={`${
            formData.category?.id === 1003
              ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
              : ""
          }`}
        >
          <div className="w-full">
            <label className="block text-textPrimary dark:text-textPrimary mb-2">
              Precio <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              min="0"
              value={formData.price || ""}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary ${
                errors.priceError
                  ? "border-red-500"
                  : "border-borderColor dark:border-borderColorHover"
              }`}
              placeholder="Ingrese el precio"
            />
            {errors.priceError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.priceError}
              </div>
            )}
          </div>

          {formData.category?.id === 1003 && (
            <div className="w-full">
              <label className="block text-textPrimary dark:text-textPrimary mb-2">
                Fecha Estimada de Entrega{" "}
                <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={formData.availabeDate}
                onChange={handleDateChange}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary ${
                  errors.dateError
                    ? "border-red-500"
                    : "border-borderColor dark:border-borderColorHover"
                }`}
                wrapperClassName="w-full"
              />
              {errors.dateError && (
                <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                  <AiOutlineExclamationCircle className="w-5 h-5" />
                  {errors.dateError}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-textPrimary dark:text-textPrimary mb-2">
            Áreas Comunes
          </label>
          <select
            onChange={(e) => handleSelectChange(e, "commonAreas")}
            className="w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary"
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
          <label className="block text-textPrimary dark:text-textPrimary mb-2">
            Servicios Cercanos
          </label>
          <select
            onChange={(e) => handleSelectChange(e, "nearbyService")}
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
            {formData.nearbyService?.map((service) => (
              <div
                key={service.id}
                className="bg-primary dark:bg-primaryLight text-white px-3 py-1 m-1 rounded-full flex items-center"
              >
                {service.name}
                <button
                  className="ml-2 text-white hover:text-textPrimary"
                  onClick={() => handleRemoveTag(service.id, "nearbyService")}
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
