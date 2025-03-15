"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { Search, ShoppingCart, KeySquare } from "lucide-react";
import { useGetProperties } from "@/app/hooks/realEstate/useGetProperties";
import FilterMapControls from "@/app/ui/realEstate/filter/filterMapControls";
import ProjectSkeletonList from "@/app/ui/skeletons/projectSkeletonList";

const MapToggleButton = dynamic(
  () => import("@/app/ui/realEstate/filter/mapToggleButton"),
  {
    ssr: false,
  }
);
const ProjectsContainer = dynamic(
  () => import("@/app/ui/realEstate/projectsContainer"),
  {
    loading: () => <ProjectSkeletonList count={8} />,
    ssr: false,
  }
);

export default function RealEstatePage() {
  const [selectedButtons, setSelectedButtons] = useState<
    Record<string, number[]>
  >({
    cities: [],
    propertyTypes: [],
    housingTypes: [],
    commonAreas: [],
    nearbyServices: [],
    bedrooms: [0],
    bathrooms: [0],
    lobbies: [0],
    area: [1],
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [areaRange, setAreaRange] = useState({ min: 0, max: 0 });

  const [entriesPerPage] = useState(16);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [projectTypeId, setProjectTypeId] = useState(2);

  const {
    projects,
    totalEntries,
    fetchMoreProjects,
    debouncedSearch,
    isLoading,
  } = useGetProperties({
    entriesPerPage,
    selectedButtons,
    projectTypeId,
    bounds: showMap ? bounds : null,
    showMap,
  });

  useEffect(() => {
    setPriceRange({ min: 0, max: 2500000000 });
    setAreaRange({ min: 0, max: 5000 });
    setSelectedButtons((prev) => ({ ...prev, price: [], area: [] }));
  }, []);

  useEffect(() => {
    if (!showMap) {
      setBounds(null);
    }
  }, [showMap]);

  console.log(projects);
  return (
    <div className="relative">
      <div className="px-6 pb-2 pt-6">
        <h1 className="mt-16 text-center text-3xl font-semibold text-client-text mb-10">
          Inmobiliaria
        </h1>

        <div className="mb-6 flex items-center justify-center gap-4">
          {[
            { id: 2, label: "Venta", icon: <ShoppingCart /> },
            { id: 3, label: "Arriendo", icon: <KeySquare /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setProjectTypeId && setProjectTypeId(id)}
              className={`flex items-center gap-2 border px-4 py-2 rounded-full shadow-md text-sm font-medium transition whitespace-nowrap ${
                projectTypeId === id
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-transparent text-client-text border-client-text hover:bg-white hover:text-black"
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="mb-10 flex flex-col items-center gap-8 sm:px-6 md:flex-row md:justify-between">
          <div className="relative w-full">
            <input
              name="searchProject"
              type="text"
              placeholder="Buscar un lugar..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full rounded-md border border-client-secondary bg-client-background-light p-2 pl-10 text-client-text"
            />
            <Search className="absolute left-3 top-2 text-client-text-placeholder" />
          </div>
        </div>
      </div>

      <hr className="w-full border-client-secondary" />

      <div
        className={clsx(
          "bg-client-background px-2 sm:px-6 md:px-20 pt-2 pb-14",
          showMap && "pb-7"
        )}
      >
        <FilterMapControls
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          showMap={showMap}
          setShowMap={setShowMap}
          totalEntries={totalEntries}
        />
      </div>

      <ProjectsContainer
        projects={projects}
        totalEntries={totalEntries}
        isLoading={isLoading}
        fetchMoreProjects={fetchMoreProjects}
        filterOpen={filterOpen}
        showMap={showMap}
        setFilterOpen={setFilterOpen}
        priceRange={priceRange}
        areaRange={areaRange}
        selectedButtons={selectedButtons}
        setSelectedButtons={setSelectedButtons}
        setBounds={setBounds}
      />

      <MapToggleButton showMap={showMap} setShowMap={setShowMap} />
    </div>
  );
}
