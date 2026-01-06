import { useCallback, useMemo } from "react";
import type { City, Departament, ProjectFormData } from "@/src/interfaces";
import { useLocationProjectValidation } from "../validations";
import { useLocationGeocoder } from "./useLocationGeocoder";

interface UseLocationProjectFormOptions {
  formData: ProjectFormData;
  departaments: Departament[];
  cities: City[];
  mapAddress: string;
  setMapAddress: (value: string) => void;
  onChange: (updatedData: Partial<ProjectFormData>) => void;
  onNext: () => void;
  isProperty: boolean;
}

export function useLocationProjectForm({
  formData,
  departaments,
  cities,
  mapAddress,
  setMapAddress,
  onChange,
  onNext,
  isProperty,
}: UseLocationProjectFormOptions) {
  const { errors, validateFields, validateField } =
    useLocationProjectValidation(formData, isProperty);

  const propertyOptions = useMemo(
    () => departaments.map((dep) => ({ id: dep.id, name: dep.name })),
    [departaments]
  );

  const cityOptions = useMemo(
    () =>
      cities
        .filter(
          (city) => city.departament.id === formData.city?.departament?.id
        )
        .map((city) => ({ id: city.id, name: city.name })),
    [cities, formData.city?.departament?.id]
  );

  const isMapsReady = true;
  const { resolveLocation } = useLocationGeocoder();
  const normalizeText = useCallback((value: string) => {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }, []);

  const handleDepartamentChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const departamentId = parseInt(e.target.value);
      const selectedDepartament = departaments.find(
        (dep) => dep.id === departamentId
      );

      if (
        selectedDepartament &&
        selectedDepartament.id !== formData.city?.departament?.id
      ) {
        onChange({
          city: { id: 0, name: "", departament: selectedDepartament },
        });
        validateField("departamentError", departamentId);
      }
    },
    [departaments, formData.city?.departament?.id, onChange, validateField]
  );

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const cityId = parseInt(e.target.value);
      const selectedCity = cities.find((city) => city.id === cityId);

      if (selectedCity && selectedCity.id !== formData.city?.id) {
        onChange({
          city: selectedCity,
        });
        validateField("cityError", cityId);
      }
    },
    [cities, formData.city?.id, onChange, validateField]
  );

  const handleAddressSelect = useCallback(
    async (suggestion: {
      placeId: string;
      description: string;
      lat: number;
      lng: number;
    }) => {
      const { lat, lng, description } = suggestion;
      const result = await resolveLocation({ lat, lng });
      const formattedAddress = result?.address || description;
      const cityName = result?.city || "";
      const departmentName = result?.department || "";

      setMapAddress(formattedAddress);

      const selectedCity = cities.find(
        (city) => normalizeText(city.name) === normalizeText(cityName)
      );
      const selectedDepartment = departaments.find(
        (department) =>
          normalizeText(department.name) === normalizeText(departmentName)
      );

      if (selectedCity && selectedDepartment) {
        if (
          selectedCity.id !== formData.city?.id ||
          selectedDepartment.id !== formData.city?.departament?.id
        ) {
          onChange({
            address: formattedAddress,
            latitude: lat,
            longitude: lng,
            city: selectedCity,
          });
        } else {
          onChange({
            address: formattedAddress,
            latitude: lat,
            longitude: lng,
          });
        }
      } else {
        onChange({
          address: formattedAddress,
          latitude: lat,
          longitude: lng,
        });
      }

      validateField("addressError", formattedAddress);
    },
    [
      cities,
      departaments,
      formData.city?.departament?.id,
      formData.city?.id,
      normalizeText,
      onChange,
      resolveLocation,
      setMapAddress,
      validateField,
    ]
  );

  const handleNext = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();

      if (formData.projectType?.id !== 1) {
        const propertyTypeName = formData.propertyType?.name || "Propiedad";
        const projectTypeName = formData.projectType?.name || "";
        const cityName = formData.city?.name || "";
        const departamentName = formData.city?.departament?.name || "";
        const generatedName =
          `${propertyTypeName} en ${projectTypeName} en ${cityName}, ${departamentName}`.trim();

        onChange({ name: generatedName });
      }

      if (validateFields(mapAddress)) {
        onNext();
      }
    },
    [formData, mapAddress, onChange, onNext, validateFields]
  );

  const tooltipTexts = useMemo(
    () => ({
      departament:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Seleccione el departamento donde se encuentra la propiedad."
          : "Seleccione el departamento donde se encuentra el proyecto.",
      city:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Seleccione la ciudad correspondiente la propiedad."
          : "Seleccione la ciudad correspondiente al proyecto.",
      address:
        formData.projectType?.id === 2 || formData.projectType?.id === 3
          ? "Ingrese la direccion de la propiedad."
          : "Ingrese la direccion del proyecto.",
    }),
    [formData.projectType?.id]
  );

  const handleMapAddressChange = useCallback(
    (value: string) => {
      setMapAddress(value);
    },
    [setMapAddress]
  );

  const handleMapLocationSelect = useCallback(
    (coords: {
      lat: number;
      lng: number;
      address?: string;
      city?: string;
      department?: string;
    }) => {
      setMapAddress(coords.address ?? "");

      const selectedCity = cities.find(
        (city) => normalizeText(city.name) === normalizeText(coords.city ?? "")
      );
      const selectedDepartment = departaments.find(
        (department) =>
          normalizeText(department.name) ===
          normalizeText(coords.department ?? "")
      );

      const currentCityId = formData.city?.id || 0;
      const currentDepartmentId = formData.city?.departament?.id || 0;

      if (selectedCity && selectedDepartment) {
        if (
          selectedCity.id !== currentCityId ||
          selectedDepartment.id !== currentDepartmentId
        ) {
          onChange({
            latitude: coords.lat,
            longitude: coords.lng,
            city: selectedCity,
          });
        } else {
          onChange({
            latitude: coords.lat,
            longitude: coords.lng,
          });
        }
      } else {
        onChange({
          latitude: coords.lat,
          longitude: coords.lng,
        });
      }
    },
    [
      cities,
      departaments,
      formData.city?.departament?.id,
      formData.city?.id,
      normalizeText,
      onChange,
      setMapAddress,
    ]
  );

  return {
    errors,
    propertyOptions,
    cityOptions,
    isMapsReady,
    handleDepartamentChange,
    handleCityChange,
    handleAddressSelect,
    handleNext,
    tooltipTexts,
    handleMapAddressChange,
    handleMapLocationSelect,
  };
}
