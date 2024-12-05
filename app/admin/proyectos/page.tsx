"use client";

import { useState, useRef, useEffect } from "react";
import { useGetProjects } from "@/app/hooks/useGetProjects";
import { ProjectSummary } from "@/lib/definitios";
import ProjectFilter from "@/app/ui/projects/filter/projectFilter";
import ProjectCard from "@/app/ui/projects/projectCard";
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

  const mapRef = useRef<HTMLDivElement>(null);

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
      {/* Header */}
      {!showMap && (
        <div className="bg-backgroundDark dark:bg-backgroundLight px-6 pt-6 pb-2">
          <h1 className="mt-24 text-3xl text-center font-semibold mb-16 text-primary dark:text-primaryLight">
            Gestión de Proyectos
          </h1>

          {/* Botones de categorías */}
          {/*
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
                  ? "bg-primary dark:bg-primaryLight hover:bg-primaryDark text-white"
                  : "bg-backgroundLight dark:bg-background hover:bg-backgroundDark dark:hover:bg-backgroundLight text-primary dark:text-primaryLight"
              }`}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>
        */}

          <div
            className={`flex flex-col md:flex-row md:justify-between items-center gap-8 mb-10 px-6 ${
              showMap ? "hidden" : "block"
            }`}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar proyectos..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="p-2 pl-10 border border-borderColor dark:border-borderColorHover rounded-md w-full bg-backgroundLight dark:bg-background text-textPrimary dark:text-textPrimary"
              />
              <FaSearch className="absolute left-3 top-3 text-textPlaceholder dark:text-textSecondary" />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row items-center">
              <Link
                href="/admin/proyectos/membresias"
                className="flex items-center space-x-2 px-6 py-2 rounded-lg shadow-md bg-primary dark:bg-primaryLight text-white hover:bg-primaryDark transition-colors whitespace-nowrap"
              >
                <span>Membresías</span>
              </Link>

              {/* Botón de Nuevo Proyecto */}
              <Link
                href="/admin/proyectos/crear-proyecto"
                className="flex items-center space-x-2 px-6 py-2 rounded-lg shadow-md bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-800 transition-colors whitespace-nowrap"
              >
                <FaPlus />
                <span>Nuevo Proyecto</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <hr
        className={`border-borderColor dark:border-borderColorHover w-full ${
          showMap ? "hidden" : "block"
        }`}
      />

      <div
        className={`bg-backgroundDark dark:bg-backgroundLight px-6 pt-2 ${
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
          <div className="relative top-32 z-0 border-t border-t-borderColorHover h-screen">
            <ProjectsMap projects={projects} />
          </div>
        ) : (
          <div className="-mt-10 mb-10 flex flex-col sm:flex-row sm:justify-between space-x-6 gap-4 py-4 px-6 lg:px-8 xl:px-20">
            {/* Sidebar de filtros */}
            {!showMap && (
              <div
                className={`flex flex-col items-center w-full sm:px-10 sm:w-72 ${
                  filterOpen ? "block" : "hidden"
                }`}
              >
                <ProjectFilter
                  selectedButtons={selectedButtons}
                  setSelectedButtons={setSelectedButtons}
                  setFilterOpen={setFilterOpen}
                  priceRange={priceRange}
                  areaRange={areaRange}
                />
              </div>
            )}

            <div className="flex flex-col w-full">
              <div
                className={`grid gap-x-4 gap-y-6 mb-8 ${
                  filterOpen
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
                }`}
              >
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex justify-center items-center relative"
                  >
                    <div className="w-full max-w-xs">
                      <ProjectCard
                        key={project.id}
                        images={project.projectMedia}
                        name={project.name}
                        location={`${project.city.name}, ${project.city.departament.name}`}
                        price={project.price}
                        area={project.totalArea}
                        isFromMap={false}
                        showActions={true}
                        onClose={null}
                        url={`/admin/proyectos/${project.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {currentProjects.length < totalEntries && (
                <button
                  onClick={fetchMoreProjects}
                  disabled={isLoading}
                  className="mt-6 px-6 py-2 rounded-lg shadow-lg bg-primary dark:bg-primaryLight text-white hover:bg-primaryDark transition-colors self-center"
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
