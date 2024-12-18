"use client";

import { useState, useEffect } from "react";
import { useGetProjects } from "@/app/hooks/useGetProjects";
import { ProjectSummary } from "@/lib/definitios";
import ProjectsContainer from "@/app/ui/projects/projectsContainer";
import FilterMapControls from "@/app/ui/projects/filter/filterMapControls";
import ProjectsMap from "@/app/ui/projects/projectsMap";
import { FaSearch, FaPlus } from "react-icons/fa";
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
  const projectTypeId = 1;

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
          <h1 className="mt-24 text-3xl text-center font-semibold mb-16 text-premium-primary dark:text-premium-primaryLight">
            Gestión de Proyectos
          </h1>

          <div
            className={`flex flex-col md:flex-row md:justify-between items-center gap-8 mb-10 sm:px-6 ${
              showMap ? "hidden" : "block"
            }`}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar proyectos..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="p-2 pl-10 border border-premium-borderColor dark:border-premium-borderColorHover rounded-md w-full bg-premium-backgroundLight dark:bg-premium-background text-premium-textPrimary dark:text-premium-textPrimary"
              />
              <FaSearch className="absolute left-3 top-3 text-premium-textPlaceholder dark:text-premium-textSecondary" />
            </div>

            <Link
              href="/admin/proyectos/crear-proyecto"
              className="flex items-center space-x-2 px-6 py-2 rounded-lg shadow-md bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-800 transition-colors whitespace-nowrap"
            >
              <FaPlus />
              <span>Nuevo Proyecto</span>
            </Link>
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
          isProperty={false}
        />
      )}
    </div>
  );
}
