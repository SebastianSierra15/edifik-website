"use client";

import clsx from "clsx";
import { ProjectSummary } from "@/lib/definitios";
import { useProjectsMetadata } from "@/app/hooks/projects/useProjectsMetadata";
import ProjectFilter from "@/app/ui/projects/filter/projectFilter";
import ProjectCard from "@/app/ui/projects/projectCard";
import ProjectCardSkeleton from "./skeleton/projectCardSkeleton";
import ProjectsMap from "@/app/ui/projects/projectsMap";

interface ProjectsContainerProps {
  projects: ProjectSummary[];
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
  isProperty: boolean;
  setBounds: (bounds: google.maps.LatLngBounds | null) => void;
}

export default function ProjectsContainer({
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
  isProperty,
  setBounds,
}: ProjectsContainerProps) {
  const skeletonCount = 8;

  const { metadata, isLoadingMetadata } = useProjectsMetadata();

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
          <ProjectsMap projects={projects} setBounds={setBounds} />
        </div>
      ) : (
        <div
          className={clsx(
            "-mt-10 mb-10 flex w-full flex-col",
            !filterOpen
              ? " px-6 py-4 lg:px-8 xl:px-20"
              : " pr-6 p-4 lg:pr-8 xl:pr-20"
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
            {isLoading
              ? Array.from({ length: skeletonCount }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="relative flex items-center justify-center"
                  >
                    <div className="w-full max-w-xs">
                      <ProjectCardSkeleton />
                    </div>
                  </div>
                ))
              : projects.map((project) => (
                  <div
                    key={project.id}
                    className="relative flex items-center justify-center"
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
                        url={
                          isProperty
                            ? `/inmobiliaria/${project.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`
                            : `/proyectos/${project.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`
                        }
                        urlEdit={
                          isProperty
                            ? `/admin/propiedades/${project.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`
                            : `/admin/proyectos/${project.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`
                        }
                      />
                    </div>
                  </div>
                ))}
          </div>

          {projects.length < totalEntries && (
            <button
              onClick={fetchMoreProjects}
              disabled={isLoading}
              className={clsx(
                "mt-6 self-center rounded-lg px-6 py-2 text-white shadow-lg transition-colors",
                isLoading
                  ? "bg-premium-primaryDark cursor-not-allowed"
                  : "bg-premium-primary hover:bg-premium-primaryDark dark:bg-premium-primaryLight dark:hover:bg-premium-primaryDark"
              )}
            >
              {isLoading ? "Cargando..." : "Mostrar más"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
