"use client";

import React, { useEffect, useMemo } from "react";
import clsx from "clsx";
import { ProjectView } from "@/lib/definitios";
import { useProjectsMetadata } from "@/app/hooks/projects/metadata/useProjectsMetadata";
import ProjectFilter from "./projectFilter";
import PropertyCard from "./PropertyCard";
import ProjectsMap from "./projectsMap";

interface ProjectsContainerProps {
  projects: ProjectView[];
  totalEntries: number;
  isLoading: boolean;
  fetchMoreProjects: () => void;
  filterOpen: boolean;
  showMap: boolean;
  setFilterOpen: (open: boolean) => void;
  priceRange: { min: number; max: number };
  areaRange: { min: number; max: number };
  selectedButtons: Record<string, number[]>;
  setSelectedButtons: React.Dispatch<
    React.SetStateAction<Record<string, number[]>>
  >;
  setBounds: (bounds: google.maps.LatLngBounds | null) => void;
}

const ProjectsContainer = ({
  projects,
  totalEntries,
  isLoading,
  fetchMoreProjects,
  filterOpen,
  showMap,
  setFilterOpen,
  priceRange,
  areaRange,
  selectedButtons,
  setSelectedButtons,
  setBounds,
}: ProjectsContainerProps) => {
  const { metadata, isLoadingMetadata } = useProjectsMetadata();

  useEffect(() => {
    const startMetadataFetch = performance.now();

    return () => {
      const endMetadataFetch = performance.now();
      console.log(
        `⏱️ Tiempo total de fetch de metadata en ProjectsContainer: ${(endMetadataFetch - startMetadataFetch).toFixed(2)}ms`
      );
    };
  }, [metadata]);

  useEffect(() => {
    console.log("Recibiendo proyectos en ProjectsContainer:", projects);
  }, [projects]);

  const projectCards = useMemo(
    () =>
      projects.map((project) => (
        <div
          key={project.id}
          className="relative flex items-center justify-center"
        >
          <div className="w-full max-w-xs h-80">
            <PropertyCard
              id={project.id}
              images={project.images}
              price={project.price || 0}
              area={project.area}
              bedrooms={project.bedrooms || undefined}
              bathrooms={project.bathrooms || undefined}
              parkingSpots={project.parkingSpots || undefined}
              url="/inmobiliaria"
            />
          </div>
        </div>
      )),
    [projects]
  );

  return (
    <div
      className={clsx(
        "flex flex-col sm:flex-row sm:justify-between",
        filterOpen && "gap-4 sm:space-x-6"
      )}
    >
      {filterOpen && (
        <div
          className={clsx(
            "sm:ml-6 lg:ml-8 xl:ml-20 w-full flex flex-col items-center sm:w-72 sm:px-10",
            !showMap ? "-mt-10 mb-10 py-4" : ""
          )}
        >
          <ProjectFilter
            selectedButtons={selectedButtons}
            setSelectedButtons={setSelectedButtons}
            setFilterOpen={setFilterOpen}
            priceRange={priceRange}
            areaRange={areaRange}
            metadata={metadata}
            isLoading={isLoadingMetadata}
          />
        </div>
      )}

      {showMap ? (
        <div className="relative h-screen w-full transition-transform duration-300">
          <ProjectsMap
            projects={projects}
            setBounds={setBounds}
            showMap={showMap}
          />
        </div>
      ) : (
        <div
          className={clsx(
            "-mt-10 mb-10 flex w-full flex-col",
            !filterOpen
              ? "px-6 py-4 lg:px-8 xl:px-20"
              : "pr-6 p-4 lg:pr-8 xl:pr-20"
          )}
        >
          <div
            className={clsx(
              "mb-8 grid gap-x-4 gap-y-6",
              filterOpen
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
            )}
          >
            {projectCards}
          </div>

          {projects.length < totalEntries && (
            <button
              onClick={fetchMoreProjects}
              disabled={isLoading}
              className={clsx(
                "mt-6 self-center rounded-lg px-6 py-2 text-white shadow-lg transition-colors",
                isLoading
                  ? "bg-client-primaryDark cursor-not-allowed"
                  : "bg-client-primary hover:bg-client-primaryDark"
              )}
            >
              {isLoading ? "Cargando..." : "Mostrar más"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(ProjectsContainer, (prevProps, nextProps) => {
  return (
    prevProps.projects.length === nextProps.projects.length &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.totalEntries === nextProps.totalEntries &&
    JSON.stringify(prevProps.selectedButtons) ===
      JSON.stringify(nextProps.selectedButtons) &&
    prevProps.filterOpen === nextProps.filterOpen &&
    prevProps.showMap === nextProps.showMap
  );
});
