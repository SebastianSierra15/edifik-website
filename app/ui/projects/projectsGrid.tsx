"use client";

import clsx from "clsx";
import { ProjectView } from "@/lib/definitios";
import ImageCarousel from "../home/imagesCarousel";

interface ProjectsGridProps {
  projects: ProjectView[];
}

const gridClasses = [
  "col-span-2 row-span-2", // Primer proyecto (grande)
  "col-start-3", // Segundo proyecto (pequeño)
  "col-start-4", // Tercer proyecto (pequeño)
  "col-span-2 col-start-3 row-start-2", // Cuarto proyecto (mediano horizontal)
];

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <p className="text-center text-client-text">
        No hay proyectos disponibles.
      </p>
    );
  }

  console.log("Proyectos cargados:", projects);

  return (
    <div className="grid grid-cols-5 auto-rows-[200px] lg:auto-rows-[300px] gap-4 px-4">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className={clsx(
            "relative flex items-center justify-center h-80 w-full rounded-lg overflow-hidden bg-gray-500",
            gridClasses[index % 4]
          )}
        >
          <ImageCarousel
            id={project.id}
            images={project.images}
            url="proyectos"
          />
        </div>
      ))}
    </div>
  );
}
