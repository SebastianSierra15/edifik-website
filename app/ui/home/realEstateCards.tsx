"use client";

import { useMemo } from "react";
import { ProjectView } from "@/lib/definitios";
import PropertyCard from "../realEstate/PropertyCard";

interface RealEstateCardsProps {
  projects: ProjectView[];
}

export default function RealEstateCards({ projects }: RealEstateCardsProps) {
  const memoizedProjects = useMemo(() => projects, [projects]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 md:gap-x-3 lg:gap-x-6 gap-y-2">
      {memoizedProjects.map((project) => (
        <div key={project.id} className="py-2 rounded-lg">
          <div className="relative items-center w-full h-80 rounded-lg overflow-hidden bg-gray-500">
            <PropertyCard
              id={project.id}
              images={project.images}
              price={project.price}
              area={project.area}
              bedrooms={project.bedrooms}
              bathrooms={project.bathrooms}
              parkingSpots={project.parkingSpots}
              url="inmobiliaria"
            />
          </div>

          <p className="text-client-textPlaceholder mt-2">{project.cityName}</p>
          <h3 className="text-client-text font-bold">{project.name}</h3>
        </div>
      ))}
    </div>
  );
}
