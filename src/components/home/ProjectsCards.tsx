"use client";

import clsx from "clsx";
import { ProjectView } from "@/src/interfaces";
import { ImageCarousel } from "./ImageCarousel";

interface ProjectsCardsProps {
  projects: ProjectView[];
}

export function ProjectsCards({ projects }: ProjectsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className={clsx(
            "py-2 rounded-lg",
            index === 0 && "sm:col-span-2 md:col-span-1",
            index === 1 && "lg:col-span-2"
          )}
        >
          <div className="relative w-full h-80 rounded-lg overflow-hidden bg-gray-500">
            <ImageCarousel
              id={project.id}
              images={project.images}
              url="proyectos"
              priorityImage={index === 0}
            />
          </div>

          <p className="text-client-textPlaceholder mt-2">{project.cityName}</p>
          <h3 className="text-client-text font-bold">{project.name}</h3>
        </div>
      ))}
    </div>
  );
}
