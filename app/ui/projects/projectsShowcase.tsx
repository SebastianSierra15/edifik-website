"use client";

import clsx from "clsx";
import { ProjectView } from "@/lib/definitios";
import ImageCarousel from "../home/imagesCarousel";
import ProjectInfoCard from "./projectInfoCard";

interface ProjectsShowcaseProps {
  projects: ProjectView[];
  reverse?: boolean;
}

const gridClasses = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-start-3",
  "lg:col-start-4",
  "lg:col-start-3 lg:col-span-2 lg:row-start-2",
];

const reverseGridClasses = [
  "lg:col-start-1",
  "lg:col-start-2",
  "lg:col-span-2 lg:row-start-2",
  "lg:col-span-2 lg:row-span-2 lg:col-start-3",
];

const layoutFor1 = ["lg:col-span-4 lg:row-span-2"];

const layoutFor2 = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2 lg:row-span-2 lg:col-start-3",
];

const layoutFor3 = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-start-3 lg:row-span-2",
  "lg:col-start-4 lg:row-span-2",
];

export default function ProjectsShowcase({
  projects,
  reverse = false,
}: ProjectsShowcaseProps) {
  const getLayoutClass = (index: number) => {
    const length = projects.length;

    if (length === 1) return layoutFor1[0];
    if (length === 2) return layoutFor2[index];
    if (length === 3) return layoutFor3[index];

    return reverse ? reverseGridClasses[index % 4] : gridClasses[index % 4];
  };

  const hasTwoRows = (index: number): boolean => {
    const className = getLayoutClass(index);
    return className.includes("row-span-2");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:grid-rows-2 auto-rows-fr gap-4 h-[600px] sm:h-[300px]">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className={clsx(
            "relative w-full rounded-lg overflow-hidden bg-gray-500 max-sm:row-span-2",
            getLayoutClass(index)
          )}
        >
          <ImageCarousel
            id={project.id}
            images={project.images}
            url="proyectos"
            {...(!hasTwoRows(index) && {
              name: project.name,
              showName: true,
            })}
          />

          {hasTwoRows(index) && (
            <ProjectInfoCard
              id={project.id}
              name={project.name}
              location={project.cityName}
              area={project.area ?? 0}
              bedrooms={project.bedrooms ?? 0}
              bathrooms={project.bathrooms ?? 0}
            />
          )}
        </div>
      ))}
    </div>
  );
}
