"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { LatLngBounds } from "leaflet";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ProjectSummary } from "@/src/interfaces";
import { useProjectsMetadata } from "@/src/hooks/projects";
import { ProjectFilter } from "./filter/ProjectFilter";
import { ProjectCardAdmin } from "./ProjectCardAdmin";
const ProjectsMap = dynamic(
  () => import("./ProjectsMap").then((mod) => mod.ProjectsMap),
  { ssr: false }
);

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
  setBounds: (bounds: LatLngBounds | null) => void;
  onDelete: (id: number, name: string) => void;
  permission?: boolean;
  onShowUser?: (name: string) => void;
}

export function ProjectsContainer({
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
  onDelete,
  permission,
  onShowUser,
}: ProjectsContainerProps) {
  const router = useRouter();
  const { metadata, isLoadingMetadata } = useProjectsMetadata();

  const projectCards = useMemo(
    () =>
      projects.map((project) => (
        <div
          key={project.id}
          className="relative flex items-center justify-center"
        >
          <div className="w-full max-w-xs">
            <ProjectCardAdmin
              id={project.id}
              images={project.projectMedia}
              name={project.name}
              location={project.city.name}
              price={project.price || 0}
              area={project.totalArea}
              bedrooms={project.bedrooms || undefined}
              bathrooms={project.bathrooms || undefined}
              parkingSpots={project.parkingSpots || undefined}
              email={project.email ?? undefined}
              isFromMap={false}
              onClose={null}
              url={
                isProperty
                  ? `/inmobiliaria/${project.id}`
                  : `/proyectos/${project.id}`
              }
              onEdit={(projectId) =>
                router.push(
                  isProperty
                    ? `/admin/inmobiliaria/${projectId}`
                    : `/admin/proyectos/${projectId}`
                )
              }
              onDelete={onDelete}
              permission={permission}
              onShowUser={onShowUser}
            />
          </div>
        </div>
      )),
    [projects, isProperty, onDelete, permission, onShowUser, router]
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
            isProperty={isProperty}
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
        <div className="relative z-0 h-screen w-full transition-transform duration-300">
          <ProjectsMap
            projects={projects}
            setBounds={setBounds}
            showMap={showMap}
            onDelete={onDelete}
          />
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
            {projectCards}
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
