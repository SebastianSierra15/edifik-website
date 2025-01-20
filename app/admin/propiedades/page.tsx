"use client";

import { useState, useEffect } from "react";
import { useGetProjects } from "@/app/hooks/projects/useGetProjects";
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
  }, [projects]);

  useEffect(() => {
    setPriceRange({ min: 0, max: 2500000000 });
    setAreaRange({ min: 0, max: 5000 });
    setSelectedButtons((prev) => ({ ...prev, price: [], area: [] }));
  }, []);

  return (
    <div className="relative">
      {!showMap && (
        <div className="bg-premium-backgroundDark px-6 pb-2 pt-6 dark:bg-premium-backgroundLight">
          <h1 className="mt-24 text-center text-3xl font-semibold text-premium-primary dark:text-premium-primaryLight">
            Gestión de Propiedades
          </h1>

          <div className="mb-6 mt-6 flex items-center justify-center gap-4">
            {[
              { id: 2, label: "Venta", icon: <FaShoppingCart /> },
              { id: 3, label: "Arriendo", icon: <FaKey /> },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setProjectTypeId(id)}
                className={`flex items-center gap-2 rounded-lg px-6 py-2 shadow-md transition-colors ${
                  projectTypeId === id
                    ? "bg-premium-primary text-white hover:bg-premium-primaryDark dark:bg-premium-primaryLight"
                    : "bg-premium-backgroundLight text-premium-primary hover:bg-premium-backgroundDark dark:bg-premium-background dark:text-premium-primaryLight dark:hover:bg-premium-backgroundLight"
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div
            className={`mb-10 flex flex-col items-center gap-8 sm:px-6 md:flex-row md:justify-between ${
              showMap ? "hidden" : "block"
            }`}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar propiedades..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full rounded-md border border-premium-borderColor bg-premium-backgroundLight p-2 pl-10 text-premium-textPrimary dark:border-premium-borderColorHover dark:bg-premium-background dark:text-premium-textPrimary"
              />
              <FaSearch className="absolute left-3 top-3 text-premium-textPlaceholder dark:text-premium-textSecondary" />
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/admin/propiedades/crear-propiedad"
                className="flex items-center space-x-2 whitespace-nowrap rounded-lg bg-green-600 px-6 py-2 text-white shadow-md transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              >
                <FaPlus />
                <span>Nueva Propiedad</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <hr
        className={`w-full border-premium-borderColor dark:border-premium-borderColorHover ${
          showMap ? "hidden" : "block"
        }`}
      />

      <div
        className={`bg-premium-backgroundDark px-6 pt-2 dark:bg-premium-backgroundLight ${
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
        <div className="relative top-32 z-0 h-screen border-t border-t-premium-borderColorHover">
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
