"use client";

import Link from "next/link";
import type { ProjectView } from "@/src/interfaces";
import { useHomeProjects } from "@/src/hooks/projects";
import { ProjectSectionSkeleton } from "./ProjectSectionSkeleton";
import { ProjectsCards } from "./ProjectsCards";

interface ProjectsSectionProps {
  initialProjects?: ProjectView[] | null;
}

export function ProjectsSection({ initialProjects }: ProjectsSectionProps) {
  const { projects, isLoading } = useHomeProjects(3, false, {
    initialProjects,
  });

  return (
    <section className="w-full px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-client-text text-3xl font-semibold">Proyectos</h2>

          <Link href="/proyectos">
            <button className="bg-transparent border border-client-text text-client-text px-4 py-2 rounded-full shadow-md text-sm font-medium hover:bg-white hover:text-black transition whitespace-nowrap">
              Ver más →
            </button>
          </Link>
        </div>

        {isLoading ? (
          <ProjectSectionSkeleton />
        ) : (
          <ProjectsCards projects={projects} />
        )}
      </div>
    </section>
  );
}
