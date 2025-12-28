"use client";

import { useGetBasicProjects } from "@/src/hooks/projects/basic";
import { HeroSection } from "@/src/components/home";
import ProjectsShowcase from "@/app/ui/projects/projectsShowcase";
import { ProjectSkeletonList } from "@/src/components/admin";

export default function ClientProjectsPage() {
  const { projects, isLoading } = useGetBasicProjects();

  return (
    <div>
      <HeroSection
        srcImage="https://d3fhc8hmbgwz4k.cloudfront.net/public/images/bim/EdificioSanCarlosFlorencia/EdificioFlorencia6.webp"
        altImage="Nuestros Proyectos"
        title="Nuestros Proyectos"
        description="Conoce nuestros proyectos"
        objectPosition="top"
      />

      {isLoading ? (
        <ProjectSkeletonList />
      ) : projects.length > 0 ? (
        <div className="px-6 py-10">
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
            .map((projectGroup, index, array) => (
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
      ) : (
        <p className="text-center text-gray-500">
          No hay proyectos disponibles.
        </p>
      )}
    </div>
  );
}
