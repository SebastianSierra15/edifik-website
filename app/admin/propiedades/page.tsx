"use client";

import { useState, useEffect } from "react";
import { useGetProjects } from "@/app/hooks/useGetProjects";
import { ProjectSummary } from "@/lib/definitios";
import ProjectsContainer from "@/app/ui/projects/projectsContainer";
import FilterMapControls from "@/app/ui/projects/filter/filterMapControls";
import ProjectsMap from "@/app/ui/projects/projectsMap";
import { FaSearch, FaPlus, FaShoppingCart, FaKey } from "react-icons/fa";
import Link from "next/link";

export default function ProjectsPage() {
  const [selectedButtons, setSelectedButtons] = useState<
    Record<string, number[]>
  >({
    cities: [],
    propertyTypes: [],
    housingTypes: [],
    commonAreas: [],
    nearbyServices: [],
    memberships: [],
    bedrooms: [0],
    bathrooms: [0],
    lobbies: [0],
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

  const [entriesPerPage, setEntriesPerPage] = useState(16);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [currentProjects, setCurrentProjects] = useState<ProjectSummary[]>([]);
  const [projectTypeId, setProjectTypeId] = useState<number | null>(2);

  const {
    projects,
    totalEntries,
    fetchMoreProjects,
    debouncedSearch,
    isLoading,
  } = useGetProjects({
    entriesPerPage,
    selectedButtons,
    currentProjects,
    projectTypeId,
  });

  useEffect(() => {
    setCurrentProjects(projects);
    console.log(projects);
  }, [projects]);

  useEffect(() => {
    setPriceRange({ min: 0, max: 2500000000 });
    setAreaRange({ min: 0, max: 5000 });
    setSelectedButtons((prev) => ({ ...prev, price: [], area: [] }));
  }, []);

  return (
    <div className="relative">
      {!showMap && (
        <div className="bg-premium-backgroundDark dark:bg-premium-backgroundLight px-6 pt-6 pb-2">
          <h1 className="mt-24 text-3xl text-center font-semibold text-premium-primary dark:text-premium-primaryLight">
            Gestión de Propiedades
          </h1>

          <div className="flex justify-center items-center gap-4 mt-6 mb-6">
            {[
              { id: 2, label: "Venta", icon: <FaShoppingCart /> },
              { id: 3, label: "Arriendo", icon: <FaKey /> },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setProjectTypeId(id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg shadow-md transition-colors ${
                  projectTypeId === id
                    ? "bg-premium-primary dark:bg-premium-primaryLight hover:bg-premium-primaryDark text-white"
                    : "bg-premium-backgroundLight dark:bg-premium-background hover:bg-premium-backgroundDark dark:hover:bg-premium-backgroundLight text-premium-primary dark:text-premium-primaryLight"
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div
            className={`flex flex-col md:flex-row md:justify-between items-center gap-8 mb-10 sm:px-6 ${
              showMap ? "hidden" : "block"
            }`}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar propiedades..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="p-2 pl-10 border border-premium-borderColor dark:border-premium-borderColorHover rounded-md w-full bg-premium-backgroundLight dark:bg-premium-background text-premium-textPrimary dark:text-premium-textPrimary"
              />
              <FaSearch className="absolute left-3 top-3 text-premium-textPlaceholder dark:text-premium-textSecondary" />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row items-center">
              <Link
                href="/admin/propiedades/crear-propiedad"
                className="flex items-center space-x-2 px-6 py-2 rounded-lg shadow-md bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-800 transition-colors whitespace-nowrap"
              >
                <FaPlus />
                <span>Nueva Propiedad</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <hr
        className={`border-premium-borderColor dark:border-premium-borderColorHover w-full ${
          showMap ? "hidden" : "block"
        }`}
      />

      <div
        className={`bg-premium-backgroundDark dark:bg-premium-backgroundLight px-6 pt-2 ${
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

      {showMap ? (
        <div className="relative top-32 z-0 border-t border-t-premium-borderColorHover h-screen">
          <ProjectsMap projects={projects} />
        </div>
      ) : (
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
          isProperty={true}
        />
      )}
    </div>
  );
}
