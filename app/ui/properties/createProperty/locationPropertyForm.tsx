"use client";

import { useState, useRef, useEffect } from "react";
import { LatLngTuple } from "leaflet";
import { AiOutlineExclamationCircle, AiOutlineClose } from "react-icons/ai";
import StepNavigationButtons from "../../stepNavigationButtons";
import LocationMap from "../locationMap";
import { useAddressSearch } from "@/app/hooks/useAddressSearch";
import { PropertyData } from "@/lib/definitios";

interface LocationPropertyFormProps {
  formData: PropertyData;
  onChange: (updatedData: Partial<PropertyData>) => void;
  onSubmit: (data: Partial<PropertyData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  locations: {
    departaments: { id: number; name: string }[];
    cities: Record<number, { id: number; name: string }[]>;
  };
}

export default function LocationPropertyForm({
  formData,
  onChange,
  onPrevious,
  onNext,
  currentStep,
  totalSteps,
  locations,
}: LocationPropertyFormProps) {
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
    const selectedDepartament = locations.departaments.find(
      (dep) => dep.id === departamentId
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
    const selectedCity = locations.cities[
      formData.city?.departament?.id || 0
    ]?.find((city) => city.id === cityId);

    if (selectedCity && formData.city?.departament) {
      onChange({
        city: {
          ...selectedCity,
          departament: formData.city.departament,
        },
      });

      setErrors((prevErrors) => ({ ...prevErrors, cityError: "" }));
    }
  };

  const handleAddressSelect = (
    lat: string,
    lon: string,
    displayName: string
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
    <div className="container mx-auto max-w-2xl p-6 bg-backgroundLight dark:bg-backgroundDark rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary dark:text-primaryLight text-center mb-6">
        Ubicación de la Propiedad
      </h2>

      <form className="space-y-6">
        {/* Departamento y Ciudad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-textPrimary dark:text-textPrimary mb-2">
              Departamento <span className="text-red-500">*</span>
            </label>
            <select
              name="departament"
              value={formData.city?.departament?.id || ""}
              onChange={handleDepartamentChange}
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                errors.departamentError
                  ? "border-red-500"
                  : "border-borderColor"
              }`}
            >
              <option value="">Seleccione un departamento</option>
              {locations.departaments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>
            {errors.departamentError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.departamentError}
              </div>
            )}
          </div>

          <div>
            <label className="block text-textPrimary dark:text-textPrimary mb-2">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <select
              name="city"
              value={formData.city?.id || ""}
              onChange={handleCityChange}
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                errors.cityError ? "border-red-500" : "border-borderColor"
              }`}
            >
              <option value="">Seleccione una ciudad</option>
              {locations.cities[formData.city?.departament?.id || 0]?.map(
                (city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                )
              )}
            </select>
            {errors.cityError && (
              <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
                <AiOutlineExclamationCircle className="w-5 h-5" />
                {errors.cityError}
              </div>
            )}
          </div>
        </div>

        {/* Dirección */}
        <div className="relative">
          <label className="block text-textPrimary dark:text-textPrimary mb-2">
            Dirección <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center">
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleAddressInput}
              disabled={!formData.city || !formData.city.id}
              className={`w-full px-3 py-2 border rounded-md bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary ${
                errors.addressError ? "border-red-500" : "border-borderColor"
              }`}
              placeholder="Ingrese la dirección"
            />
            {formData.address && (
              <button
                type="button"
                className="absolute right-3 text-gray-500 hover:text-gray-700"
                onClick={() => onChange({ address: "" })}
              >
                <AiOutlineClose className="w-5 h-5" />
              </button>
            )}
          </div>

          <ul
            ref={listRef}
            className={`list-group mt-2 max-h-40 overflow-y-auto bg-background dark:bg-backgroundLight text-textPrimary dark:text-textPrimary border border-borderColor rounded-md shadow-lg ${
              isListVisible ? "block" : "hidden"
            }`}
          >
            {loading && <li className="p-2">Cargando...</li>}
            {error && <li className="p-2 text-red-500">{error}</li>}
            {results.map((result) => (
              <li
                key={`${result.lat}-${result.lon}`}
                className="list-group-item p-2 hover:bg-backgroundDark dark:hover:bg-backgroundDark cursor-pointer"
                onClick={() => {
                  handleAddressSelect(
                    result.lat,
                    result.lon,
                    result.display_name
                  );
                  setIsListVisible(false);
                }}
              >
                {result.display_name}
              </li>
            ))}
          </ul>

          {errors.addressError && (
            <div className="text-red-500 text-xs flex items-center gap-2 mt-1">
              <AiOutlineExclamationCircle className="w-5 h-5" />
              {errors.addressError}
            </div>
          )}
        </div>

        {/* Mapa */}
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
