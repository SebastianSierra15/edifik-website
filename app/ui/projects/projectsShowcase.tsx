"use client";

import clsx from "clsx";
import { ProjectView } from "@/lib/definitios";
import ImageCarousel from "../home/imagesCarousel";

interface ProjectsShowcaseProps {
  projects: ProjectView[];
}

const gridClasses = [
  "col-span-2 row-span-2", // Primer proyecto (grande)
  "col-start-3", // Segundo proyecto (pequeño)
  "col-start-4", // Tercer proyecto (pequeño)
  "col-span-2 col-start-3 row-start-2", // Cuarto proyecto (mediano horizontal)
];

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 h-[400px] gap-4">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className={clsx(
            "relative w-full h-full rounded-lg overflow-hidden bg-gray-500",
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
