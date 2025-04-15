"use client";

import { useGetBasicProjects } from "@/app/hooks/projects/basic/useGetBasicProjects";
import HeroSection from "@/app/ui/home/heroSection";
import ProjectsShowcase from "@/app/ui/projects/projectsShowcase";
import ProjectSkeletonList from "@/app/ui/skeletons/projectSkeletonList";

export default function ClientProjectsPage() {
  const { projects, isLoading } = useGetBasicProjects();

  return (
    <div>
      <HeroSection
        srcImage="/images/home/home.webp"
        altImage="Nuestros proyectos"
        title="Proyectos"
        description="Conoce nuestros proyectos"
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
