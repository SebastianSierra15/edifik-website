"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProjectSummary } from "@/src/interfaces";
import { ProjectCard } from "./ProjectCard";

interface CarouselRecommendedProjectsProps {
  projects: ProjectSummary[];
}

export function CarouselRecommendedProjects({
  projects,
}: CarouselRecommendedProjectsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCardsMap = { base: 2, sm: 3, lg: 4, xl: 5 };

  const [visibleCards, setVisibleCards] = useState(visibleCardsMap.xl);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1280) setVisibleCards(visibleCardsMap.xl);
      else if (window.innerWidth >= 1024) setVisibleCards(visibleCardsMap.lg);
      else if (window.innerWidth >= 640) setVisibleCards(visibleCardsMap.sm);
      else setVisibleCards(visibleCardsMap.base);
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);

    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const totalProjects = projects.length;

  const handleNext = () => {
    if (currentIndex + visibleCards < totalProjects) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full bg-transparent py-8">
      <div className="relative flex items-center overflow-hidden">
        <button
          className={`absolute left-2 z-10 rounded-full p-3 shadow-md transition md:left-4 ${
            currentIndex === 0
              ? "bg-gray-300 text-gray-500"
              : "bg-primary hover:bg-primary-dark text-white"
          }`}
          onClick={handlePrev}
          aria-label="Previous"
          disabled={currentIndex === 0}
        >
          <ChevronLeft />
        </button>

        <div className="w-full overflow-hidden">
          <div
            className="flex py-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / visibleCards}%)`,
              width: `${(projects.length * 100) / visibleCards}%`,
            }}
          >
            {projects.map((project, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-2"
                style={{
                  width: `${100 / visibleCards}%`,
                }}
              >
                <ProjectCard
                  id={project.id}
                  images={project.projectMedia || []}
                  name={project.name}
                  location={project.city.name}
                  price={project.price ?? undefined}
                  area={project.totalArea}
                  bedrooms={project.bedrooms ?? undefined}
                  bathrooms={project.bathrooms ?? undefined}
                  parkingSpots={project.parkingSpots ?? undefined}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          className={`absolute right-2 z-10 rounded-full p-3 shadow-md transition md:right-4 ${
            currentIndex + visibleCards >= totalProjects
              ? "bg-gray-300 text-gray-500"
              : "bg-primary hover:bg-primary-dark text-white"
          }`}
          onClick={handleNext}
          aria-label="Next"
          disabled={currentIndex + visibleCards >= totalProjects}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
