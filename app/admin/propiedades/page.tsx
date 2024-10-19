"use client";

import { useState, useRef, useEffect } from "react";
import { useProperties } from "@/app/hooks/useProperties";
import { PropertySummary } from "@/lib/definitios";
import PropertyFilter from "@/app/ui/properties/propertyFilter";
import PropertyCard from "@/app/ui/properties/propertyCard";
import FilterMapControls from "@/app/ui/properties/filterMapControls";
import PropertiesMap from "@/app/ui/properties/propertiesMap";
import {
  FaGlobe,
  FaHome,
  FaClipboardList,
  FaBuilding,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import Link from "next/link";

const categoryButtons = [
  { id: "", label: "Todas", icon: FaGlobe },
  { id: "1002", label: "Venta", icon: FaHome },
  { id: "1003", label: "Sobre Planos", icon: FaClipboardList },
  { id: "1004", label: "Arriendo", icon: FaBuilding },
];

export default function PropertiesPage() {
  const [selectedButtons, setSelectedButtons] = useState<
    Record<string, number[]>
  >({
    cities: [],
    propertyTypes: [],
    housingTypes: [],
    commonAreas: [],
    nearbyServices: [],
    memberships: [],
    rooms: [1],
    bathrooms: [1],
    lobbies: [1],
    price: [1],
    area: [1],
  });

  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });
  const [areaRange, setAreaRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });

  const [selectedCategory, setSelectedCategory] = useState("1002,1003,1004");
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [currentProperties, setCurrentProperties] = useState<PropertySummary[]>(
    []
  );

  const mapRef = useRef<HTMLDivElement>(null);

  const {
    properties,
    totalEntries,
    fetchMoreProperties,
    debouncedSearch,
    isLoading,
  } = useProperties({
    entriesPerPage,
    selectedCategory,
    selectedButtons,
    currentProperties,
  });

  useEffect(() => {
    setCurrentProperties(properties);
  }, [properties]);

  useEffect(() => {
    const ranges: Record<
      string,
      {
        price: { min: number; max: number };
        area: { min: number; max: number };
      }
    > = {
      "1002": {
        price: { min: 0, max: 2500000000 },
        area: { min: 0, max: 5000 },
      },
      "1003": {
        price: { min: 0, max: 2500000000 },
        area: { min: 0, max: 2000 },
      },
      "1004": { price: { min: 0, max: 10000000 }, area: { min: 0, max: 1000 } },
      default: {
        price: { min: 0, max: 2500000000 },
        area: { min: 0, max: 5000 },
      },
    };

    const { price, area } =
      ranges[selectedCategory as keyof typeof ranges] || ranges.default;

    setPriceRange(price);
    setAreaRange(area);

    setSelectedButtons((prev) => ({ ...prev, price: [], area: [] }));
  }, [selectedCategory]);

  return (
    <div className="relative">
      {/* Header */}
      <div className="bg-backgroundDark dark:bg-darkBackgroundLight px-6 pt-6 pb-2">
        <h1 className="mt-24 text-3xl text-center font-semibold mb-10 text-primary dark:text-primaryLight">
          Gestión de Propiedades
        </h1>

        {/* Botones de categorías */}
        <div
          className={`flex flex-wrap justify-center items-center gap-4 ${
            showMap ? "mb-0" : "mb-6"
          }`}
          ref={mapRef}
        >
          {categoryButtons.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md transition-colors ${
                selectedCategory === id
                  ? "bg-primary dark:bg-primary hover:bg-primaryDark text-white"
                  : "bg-white dark:bg-darkBackgroundLight text-primary dark:text-primaryLight hover:bg-backgroundDark dark:hover:bg-darkBackground"
              }`}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Barra de búsqueda, botón Nueva Propiedad y botón de Membresías */}
        <div
          className={`flex flex-col md:flex-row md:justify-between items-center gap-8 mb-10 px-6 ${
            showMap ? "hidden" : "block"
          }`}
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar propiedades..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="p-2 pl-10 border border-borderColor dark:border-borderColor focus:border-borderColorHover dark:focus:border-borderColorHover rounded-md w-full bg-white dark:bg-darkBackgroundLight text-textPrimary dark:text-darkTextPrimary"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-darkTextSecondary" />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row items-center">
            <Link href="/admin/propiedades/membresias" passHref>
              <button className="flex items-center space-x-2 px-6 py-2 rounded-lg shadow-md bg-primary dark:bg-primary text-white hover:bg-primaryDark dark:hover:bg-primaryDark transition-colors whitespace-nowrap">
                <span>Membresías</span>
              </button>
            </Link>

            <Link href="/admin/propiedades/crearPropiedad">
              <button className="flex items-center space-x-2 px-6 py-2 rounded-lg shadow-md bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-800 transition-colors whitespace-nowrap">
                <FaPlus />
                <span>Nueva Propiedad</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <hr
        className={`border-borderColor dark:border-darkBorderColor w-full ${
          showMap ? "hidden" : "block"
        }`}
      />

      <div
        className={`bg-backgroundDark dark:bg-darkBackgroundLight px-6 pt-2 ${
          showMap ? "pb-2" : "pb-14"
        }`}
      >
        <FilterMapControls
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          showMap={showMap}
          setShowMap={setShowMap}
        />
      </div>

      <div>
        {showMap ? (
          <div
            className="relative z-0 border-t border-t-gray-500"
            style={{
              height: showMap ? "calc(100vh - 160px)" : "calc(100vh - 86px)",
            }}
          >
            <PropertiesMap properties={properties} />
          </div>
        ) : (
          <div className="-mt-10 mb-10 flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-4 md:gap-8 py-4 px-6 lg:px-8 xl:px-20">
            {/* Sidebar de filtros */}
            {!showMap && (
              <div
                className={`flex flex-col items-center w-full sm:px-10 sm:w-72 ${
                  filterOpen ? "block" : "hidden"
                }`}
              >
                <PropertyFilter
                  selectedButtons={selectedButtons}
                  setSelectedButtons={setSelectedButtons}
                  setFilterOpen={setFilterOpen}
                  priceRange={priceRange}
                  areaRange={areaRange}
                />
              </div>
            )}

            {/* Mostrar propiedades */}
            <div className="flex flex-col w-full">
              <div
                className={`grid gap-x-4 gap-y-6 mb-8 ${
                  filterOpen
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
                }`}
              >
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex justify-center items-center relative"
                  >
                    <div className="w-full max-w-xs">
                      <PropertyCard
                        key={property.id}
                        images={[
                          "/images/image2.jpg",
                          "/images/image3.jpg",
                          "/images/image4.jpg",
                        ]}
                        name={property.name}
                        location={`${property.city.name}, ${property.city.departament.name}`}
                        price={property.price}
                        area={property.area}
                        idMembership={property.membership}
                        isFromMap={false}
                        showActions={true}
                        onClose={null}
                        url={`/admin/propiedades/${property.id}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón Mostrar Más */}
              {currentProperties.length < totalEntries && (
                <button
                  onClick={fetchMoreProperties}
                  disabled={isLoading}
                  className="mt-6 px-6 py-2 rounded-lg shadow-lg bg-primary dark:bg-primary text-white hover:bg-primaryDark dark:hover:bg-primaryDark transition-colors self-center"
                >
                  {isLoading ? "Cargando..." : "Mostrar más"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
