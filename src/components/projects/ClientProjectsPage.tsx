"use client";

import { useMemo } from "react";
import { useGetBasicProjects } from "@/src/hooks/projects";
import { HeroSection } from "@/src/components/home";
import {
  ProjectsShowcase,
  ProjectsSkeletonList,
} from "@/src/components/projects";

export function ClientProjectsPage() {
  const { projects, isLoading } = useGetBasicProjects();
  const groupedProjects = useMemo(() => {
    return projects.reduce(
      (acc, _, index) => {
        if (index % 4 === 0) {
          acc.push(projects.slice(index, index + 4));
        }
        return acc;
      },
      [] as (typeof projects)[]
    );
  }, [projects]);

  return (
    <div className="mb-10">
      <HeroSection
        srcImage="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/EdificioSanCarlosFlorencia/EdificioFlorencia6.webp"
        altImage="Nuestros Proyectos"
        title="Nuestros Proyectos"
        description="Conoce nuestros proyectos"
        objectPosition="top"
      />

      {isLoading || groupedProjects.length === 0 ? (
        <ProjectsSkeletonList />
      ) : (
        <div className="px-6 py-10 mt-6">
          {groupedProjects.map((projectGroup, index, array) => (
            <div key={index}>
              <ProjectsShowcase
                projects={projectGroup}
                reverse={index % 2 === 1}
              />
              {index < array.length - 1 && (
                <hr className="mx-auto my-6 w-5/6 border-t border-white bg-transparent" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
