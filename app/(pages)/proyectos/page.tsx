"use client";

import { useState, useEffect } from "react";
import { useGetProperties } from "@/app/hooks/realEstate/useGetProperties";
import ProjectSkeletonList from "@/app/ui/skeletons/projectSkeletonList";
import ProjectsShowcase from "@/app/ui/projects/projectsShowcase";

export default function ProjectPage() {
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

  const [entriesPerPage] = useState(8);
  const { projects, isLoading } = useGetProperties({
    entriesPerPage,
    selectedButtons,
    projectTypeId: 1,
    showMap: false,
  });

  useEffect(() => {
    setSelectedButtons((prev) => ({ ...prev, price: [], area: [] }));
  }, []);

  return (
    <div className="px-6 pb-10 pt-6">
      <h1 className="mt-16 text-center text-3xl font-semibold text-client-text mb-10">
        Proyectos Destacados
      </h1>

      {isLoading ? (
        <ProjectSkeletonList />
      ) : projects.length > 0 ? (
        <div className="space-y-10">
          {projects
            .reduce(
              (acc, _, index) => {
                if (index % 4 === 0) {
                  acc.push(projects.slice(index, index + 4));
                }
                return acc;
              },
              [] as (typeof projects)[]
            )
            .map((projectGroup, index) => (
              <ProjectsShowcase key={index} projects={projectGroup} />
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No hay proyectos disponibles.
        </p>
      )}
    </div>
  );
}
