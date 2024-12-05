"use client";

import { useState, useEffect } from "react";
import ProjectCard from "../projectCard";
import { ProjectSummary } from "@/lib/definitios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type CarouselRecommendedProjectsProps = {
  projects: ProjectSummary[];
};

export default function CarouselRecommendedProjects({
  projects,
}: CarouselRecommendedProjectsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCardsMap = { base: 2, sm: 3, lg: 4, xl: 5 };

  const [visibleCards, setVisibleCards] = useState(
    visibleCardsMap.xl // Default to xl screen
  );

  // Determina cuántas tarjetas mostrar según el ancho de la pantalla
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

  // Controles para avanzar y retroceder
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
        {/* Botón Prev */}
        <button
          className={`absolute left-2 md:left-4 z-10 p-3 rounded-full shadow-md transition ${
            currentIndex === 0
              ? "bg-gray-300 text-gray-500"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
          onClick={handlePrev}
          aria-label="Previous"
          disabled={currentIndex === 0} // Deshabilitar botón si no hay más tarjetas a la izquierda
        >
          <FaChevronLeft />
        </button>

        {/* Carrusel */}
        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out py-4"
            style={{
              transform: `translateX(-${(currentIndex * 100) / visibleCards}%)`, // Calcula la posición
              width: `${(projects.length * 100) / visibleCards}%`, // Calcula el ancho total del carrusel
            }}
          >
            {projects.map((project, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-2"
                style={{
                  width: `${100 / visibleCards}%`, // Calcula el ancho dinámico de cada tarjeta
                }}
              >
                <ProjectCard
                  name={project.name}
                  location={project.city.name}
                  price={project.price}
                  area={project.totalArea}
                  images={project.projectMedia || []}
                  url={`admin/projects/${project.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  isFromMap={false}
                  showActions={false}
                  onClose={null}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botón Next */}
        <button
          className={`absolute right-2 md:right-4 z-10 p-3 rounded-full shadow-md transition ${
            currentIndex + visibleCards >= totalProjects
              ? "bg-gray-300 text-gray-500"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
          onClick={handleNext}
          aria-label="Next"
          disabled={currentIndex + visibleCards >= totalProjects} // Deshabilitar botón si no hay más tarjetas a la derecha
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
