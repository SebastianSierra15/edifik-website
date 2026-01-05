"use client";

import { useMemo } from "react";
import { ProjectSummary } from "@/src/interfaces";
import { PropertyCard } from "@/src/components/realEstate";

interface PropertiesContainerProps {
  projects: ProjectSummary[];
  totalEntries: number;
  isLoading: boolean;
  fetchMoreProjects: () => void;
  onDelete: (id: number, name: string) => void;
  statusFilter: "aceptado" | "pendiente" | "revision";
}

export function PropertiesContainer({
  projects,
  totalEntries,
  isLoading,
  fetchMoreProjects,
  onDelete,
  statusFilter,
}: PropertiesContainerProps) {
  const projectCards = useMemo(
    () =>
      projects.map((project) => (
        <div key={project.id} className="flex justify-center">
          <div className="w-full max-w-xs h-80">
            <PropertyCard
              id={project.id}
              name={project.name}
              location={project.city.name}
              images={project.projectMedia}
              price={project.price || 0}
              area={project.totalArea}
              bedrooms={project.bedrooms || undefined}
              bathrooms={project.bathrooms || undefined}
              parkingSpots={project.parkingSpots || undefined}
              url={"/usuario/mis-propiedades"}
              showActions={statusFilter === "pendiente" ? false : true}
              onDelete={onDelete}
            />
          </div>
        </div>
      )),
    [projects]
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {projectCards}
      </div>

      {projects.length < totalEntries && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={fetchMoreProjects}
            disabled={isLoading}
            className="bg-client-backgroundAlt border border-white rounded-full px-6 py-2 text-white shadow-lg transition-colors hover:bg-client-white hover:text-black disabled:cursor-not-allowed"
          >
            {isLoading ? "Cargando..." : "Mostrar más"}
          </button>
        </div>
      )}
    </>
  );
}
