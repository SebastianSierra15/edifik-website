"use client";

import { useState, useRef, useEffect } from "react";
import { LatLngTuple } from "leaflet";
import {
  AiOutlineExclamationCircle,
  AiOutlineClose,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import StepNavigationButtons from "../../admin/stepNavigationButtons";
import LocationMap from "../locationMap";
import { useAddressSearch } from "@/app/hooks/useAddressSearch";
import { ProjectData, City, Departament } from "@/lib/definitios";

interface LocationProjectFormProps {
  formData: ProjectData;
  onChange: (updatedData: Partial<ProjectData>) => void;
  onSubmit: (data: Partial<ProjectData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  departaments: Departament[];
  cities: City[];
}

export default function LocationProjectForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  departaments,
  cities,
}: LocationProjectFormProps) {
  const [errors, setErrors] = useState({
    departamentError: "",
    cityError: "",
    addressError: "",
  });

  const { results, loading, error, searchAddress } = useAddressSearch();
  const [isListVisible, setIsListVisible] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange({ address: value });

    if (value.trim()) {
      searchAddress(value);
      setErrors((prevErrors) => ({ ...prevErrors, addressError: "" }));
      setIsListVisible(true);
    }
  };

  const handleDepartamentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departamentId = parseInt(e.target.value);
    const selectedDepartament = departaments.find(
      (dep) => dep.id === departamentId,
    );

    if (selectedDepartament) {
      onChange({
        city: {
          id: 0,
          name: "",
          departament: selectedDepartament,
        },
      });

      setErrors((prevErrors) => ({ ...prevErrors, departamentError: "" }));
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = parseInt(e.target.value);
    const selectedCity = cities.find((city) => city.id === cityId);

    if (selectedCity) {
      onChange({
        city: selectedCity,
      });

      setErrors((prevErrors) => ({ ...prevErrors, cityError: "" }));
    }
  };

  const handleAddressSelect = (
    lat: string,
    lon: string,
    displayName: string,
  ) => {
    onChange({
      address: displayName,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    });

    setErrors((prevErrors) => ({ ...prevErrors, addressError: "" }));
  };

  const validateForm = () => {
    const newErrors = { ...errors };

    if (!formData.city?.departament?.id) {
      newErrors.departamentError = "El departamento es obligatorio.";
    }
    if (!formData.city?.id) {
      newErrors.cityError = "La ciudad es obligatoria.";
    }
    if (!formData.address?.trim()) {
      newErrors.addressError = "La dirección es obligatoria.";
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsListVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container mx-auto max-w-2xl rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {formData.projectType?.id
          ? "Ubicación del Proyecto"
          : "Ubicación de la Propiedad"}
      </h2>

      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
              Departamento
              <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                *
              </span>
              <span className="group relative">
                <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute z-10 mt-2 hidden w-64 rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:block dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                  <p className="text-xs">
                    {formData.projectType?.id === 2 ||
                    formData.projectType?.id === 3
                      ? "Seleccione el departamento donde se encuentra la propiedad."
                      : "Seleccione el departamento donde se encuentra el proyecto."}
                  </p>
                </div>
              </span>
            </label>
            <select
              name="departament"
              value={formData.city?.departament?.id || ""}
              onChange={handleDepartamentChange}
              className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                errors.departamentError
                  ? "border-red-500"
                  : "border-premium-borderColor"
              }`}
            >
              <option value="">Seleccione un departamento</option>
              {departaments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>
            {errors.departamentError && (
              <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                <AiOutlineExclamationCircle className="h-5 w-5" />
                {errors.departamentError}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
              Ciudad
              <span className="text-premium-textPrimary dark:text-premium-textPrimary">
                *
              </span>
              <span className="group relative">
                <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                <div className="absolute z-10 mt-2 hidden w-64 rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:block dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                  <p className="text-xs">
                    {formData.projectType?.id === 2 ||
                    formData.projectType?.id === 3
                      ? "Seleccione la ciudad correspondiente la propiedad."
                      : "Seleccione la ciudad correspondiente al proyecto."}
                  </p>
                </div>
              </span>
            </label>
            <select
              name="city"
              value={formData.city?.id || ""}
              onChange={handleCityChange}
              className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                errors.cityError ? "border-red-500" : "border-borderColor"
              }`}
            >
              <option value="">Seleccione una ciudad</option>
              {cities
                .filter(
                  (city) =>
                    city.departament.id === formData.city?.departament?.id,
                )
                .map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
            </select>
            {errors.cityError && (
              <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
                <AiOutlineExclamationCircle className="h-5 w-5" />
                {errors.cityError}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <label className="mb-2 flex items-center gap-1 text-premium-textPrimary dark:text-premium-textPrimary">
            Dirección
            <span className="text-premium-textPrimary dark:text-premium-textPrimary">
              *
            </span>
            <span className="group relative">
              <AiOutlineInfoCircle className="h-4 w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
              <div className="absolute z-10 mt-2 hidden w-64 rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 text-premium-textPrimary shadow-md group-hover:block dark:border-premium-borderColorHover dark:bg-premium-backgroundDark dark:text-premium-textPrimary">
                <p className="text-xs">
                  {formData.projectType?.id === 2 ||
                  formData.projectType?.id === 3
                    ? "Ingrese la dirección de la propiedad."
                    : "Ingrese la dirección del proyecto."}
                </p>
              </div>
            </span>
          </label>

          <div className="flex items-center">
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleAddressInput}
              disabled={!formData.city || !formData.city.id}
              className={`w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary ${
                errors.addressError
                  ? "border-red-500"
                  : "border-premium-borderColor"
              }`}
              placeholder="Ingrese la dirección"
            />
            {formData.address && (
              <button
                type="button"
                className="absolute right-3 text-gray-500 hover:text-gray-700"
                onClick={() => onChange({ address: "" })}
              >
                <AiOutlineClose className="h-5 w-5" />
              </button>
            )}
          </div>

          {errors.addressError && (
            <div className="mt-1 flex items-center gap-2 text-xs text-red-500">
              <AiOutlineExclamationCircle className="h-5 w-5" />
              {errors.addressError}
            </div>
          )}
        </div>

        <LocationMap
          coordinates={
            [
              formData.latitude || 4.5709,
              formData.longitude || -74.2973,
            ] as LatLngTuple
          }
          onLocationSelect={(coords) =>
            onChange({ latitude: coords[0], longitude: coords[1] })
          }
        />

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
