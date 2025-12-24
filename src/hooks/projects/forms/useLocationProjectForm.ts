import { useCallback, useMemo } from "react";
import type { City, Departament, ProjectFormData } from "@/src/interfaces";
import { useLocationProjectValidation } from "../validations";

interface UseLocationProjectFormOptions {
  formData: ProjectFormData;
  departaments: Departament[];
  cities: City[];
  mapAddress: string;
  setMapAddress: (value: string) => void;
  onChange: (updatedData: Partial<ProjectFormData>) => void;
  onNext: () => void;
}

export function useLocationProjectForm({
  formData,
  departaments,
  cities,
  mapAddress,
  setMapAddress,
  onChange,
  onNext,
}: UseLocationProjectFormOptions) {
  const { errors, validateFields, validateField } =
    useLocationProjectValidation(formData);

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

  const isMapsReady = typeof window !== "undefined" && !!window.google?.maps;

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
          address: "",
          latitude: undefined,
          longitude: undefined,
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
          address: "",
          latitude: undefined,
          longitude: undefined,
        });
        validateField("cityError", cityId);
      }
    },
    [cities, formData.city?.id, onChange, validateField]
  );

  const handleAddressSelect = useCallback(
    async (placeId: string, description: string) => {
      const placesService = new google.maps.places.PlacesService(
        document.createElement("div")
      );

      placesService.getDetails({ placeId }, (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results?.length) {
              const formattedAddress = results[0].formatted_address;
              const foundCity = results.find((result) =>
                result.types.includes("locality")
              );
              const foundDepartment = results.find((result) =>
                result.types.includes("administrative_area_level_1")
              );

              const cityName =
                foundCity?.formatted_address.split(",")[0].trim() || "";
              const departmentName =
                foundDepartment?.formatted_address.split(",")[0].trim() || "";

              const selectedCity = cities.find(
                (city) => city.name.toLowerCase() === cityName.toLowerCase()
              );
              const selectedDepartment = departaments.find(
                (department) =>
                  department.name.toLowerCase() === departmentName.toLowerCase()
              );

              if (
                selectedCity?.id !== formData.city?.id ||
                selectedDepartment?.id !== formData.city?.departament?.id
              ) {
                onChange({
                  address: formattedAddress,
                  latitude: lat,
                  longitude: lng,
                  city: selectedCity || {
                    id: 0,
                    name: "Ciudad desconocida",
                    departament: selectedDepartment || {
                      id: 0,
                      name: "Departamento desconocido",
                    },
                  },
                });
              } else {
                onChange({ address: formattedAddress });
              }

              validateField("addressError", formattedAddress);
            }
          });
        }
      });
    },
    [
      cities,
      departaments,
      formData.city?.departament?.id,
      formData.city?.id,
      onChange,
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

      const selectedCity = cities.find((city) => city.name === coords.city);
      const selectedDepartment = departaments.find(
        (department) => department.name === coords.department
      );

      const currentCityId = formData.city?.id || 0;
      const currentDepartmentId = formData.city?.departament?.id || 0;

      if (
        selectedCity?.id !== currentCityId ||
        selectedDepartment?.id !== currentDepartmentId
      ) {
        onChange({
          latitude: coords.lat,
          longitude: coords.lng,
          city: selectedCity || {
            id: 0,
            name: "Ciudad desconocida",
            departament: selectedDepartment || {
              id: 0,
              name: "Departamento desconocido",
            },
          },
        });
      } else {
        onChange({
          latitude: coords.lat,
          longitude: coords.lng,
        });
      }
    },
    [cities, departaments, formData.city?.departament?.id, formData.city?.id, onChange, setMapAddress]
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
