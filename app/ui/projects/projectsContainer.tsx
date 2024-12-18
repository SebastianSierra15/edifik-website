"use client";

import { ProjectSummary } from "@/lib/definitios";
import ProjectFilter from "@/app/ui/projects/filter/projectFilter";
import ProjectCard from "@/app/ui/projects/projectCard";
import ProjectCardSkeleton from "./skeleton/projectCardSkeleton";

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
}: ProjectsContainerProps) {
  const skeletonCount = 8;

  return (
    <div
      className={`-mt-10 mb-10 flex flex-col sm:flex-row sm:justify-between ${
        filterOpen ? "sm:space-x-6 gap-4" : ""
      } py-4 px-6 lg:px-8 xl:px-20`}
    >
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
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="flex justify-center items-center relative"
                >
                  <div className="w-full max-w-xs">
                    <ProjectCardSkeleton />
                  </div>
                </div>
              ))
            : projects.map((project) => (
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
            className="mt-6 px-6 py-2 rounded-lg shadow-lg bg-premium-primary dark:bg-premium-primaryLight text-white hover:bg-premium-primaryDark dark:hover:bg-premium-primaryDark transition-colors self-center"
          >
            {isLoading ? "Cargando..." : "Mostrar más"}
          </button>
        )}
      </div>
    </div>
  );
}
