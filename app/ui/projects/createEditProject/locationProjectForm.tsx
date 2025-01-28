import { useCallback, useMemo } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { ProjectData, City, Departament } from "@/lib/definitios";
import { useLocationProjectValidation } from "@/app/hooks/projects/createEditProject/useLocationProjectValidation";
import FormSearchAddress from "../../modals/formSearchAddress";
import StepNavigationButtons from "../../admin/stepNavigationButtons";
import LocationMap from "../locationMap";
import FormSelect from "../../modals/formSelect";

const GOOGLE_MAPS_LIBRARIES: "places"[] = ["places"];

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

  const mapsApiKey = useMemo(
    () => process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    []
  );
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapsApiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

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
    [onChange, validateField, formData.city?.departament?.id, departaments]
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
    [onChange, validateField, formData.city?.id, cities]
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
                (c) => c.name.toLowerCase() === cityName.toLowerCase()
              );
              const selectedDepartment = departaments.find(
                (d) => d.name.toLowerCase() === departmentName.toLowerCase()
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
      onChange,
      validateField,
      formData.city?.id,
      formData.city?.departament?.id,
      cities,
      departaments,
    ]
  );

  const handleUpdateAddress = (address: string) => {
    onChange({ address });
  };

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (validateFields()) {
      onNext();
    }
  };

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
          ? "Ingrese la dirección de la propiedad."
          : "Ingrese la dirección del proyecto.",
    }),
    [formData.projectType?.id]
  );

  return (
    <div className="container mx-auto w-full rounded-lg bg-premium-backgroundLight p-6 shadow-lg dark:bg-premium-backgroundDark">
      <h2 className="mb-6 text-center text-2xl font-bold text-premium-primary dark:text-premium-primaryLight">
        {formData.projectType?.id
          ? "Ubicación del Proyecto"
          : "Ubicación de la Propiedad"}
      </h2>

      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormSelect
            label="Departamento"
            name="departament"
            value={formData.city?.departament?.id || ""}
            options={propertyOptions}
            onChange={handleDepartamentChange}
            error={errors.departamentError}
            tooltipText={tooltipTexts.departament}
          />

          <FormSelect
            label="Ciudad"
            name="city"
            value={formData.city?.id || ""}
            options={cityOptions}
            onChange={handleCityChange}
            error={errors.cityError}
            tooltipText={tooltipTexts.city}
          />
        </div>

        <div className="relative z-20">
          <FormSearchAddress
            label="Dirección"
            value={formData.address || ""}
            onChange={(value) => onChange({ address: value })}
            onSelect={handleAddressSelect}
            error={errors.addressError}
            isLoaded={isLoaded}
            tooltipText={tooltipTexts.departament}
          />
        </div>

        <div className="relative h-64 w-full">
          <LocationMap
            isLoaded={isLoaded}
            coordinates={{
              lat:
                typeof formData.latitude === "number"
                  ? formData.latitude
                  : 4.5709,
              lng:
                typeof formData.longitude === "number"
                  ? formData.longitude
                  : -74.2973,
            }}
            onLocationSelect={(coords) => {
              const selectedCity = cities.find((c) => c.name === coords.city);
              const selectedDepartment = departaments.find(
                (d) => d.name === coords.department
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
                  address: coords.address,
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
                  address: coords.address,
                });
              }
            }}
            onUpdateAddress={handleUpdateAddress}
          />
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
