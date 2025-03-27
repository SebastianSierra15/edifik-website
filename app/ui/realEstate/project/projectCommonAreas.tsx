"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { CommonArea, ProjectMedia } from "@/lib/definitios";
import ImageModal from "./imageModal";

const ChevronDown = dynamic(() =>
  import("lucide-react").then((mod) => mod.ChevronDown)
);

interface ProjectCommonAreasProps {
  areas: CommonArea[];
  projectMedia: ProjectMedia[];
}

export default function ProjectCommonAreas({
  areas,
  projectMedia,
}: ProjectCommonAreasProps) {
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleImageClick = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="my-8 w-full lg:w-2/3">
      <h2 className="mb-4 text-2xl font-semibold text-white">Áreas Comunes</h2>

      {areas.map((area, index) => {
        const areaImages = projectMedia.filter(
          (media) => media.commonArea === area.id
        );

        const isOpen = openAccordions.includes(index);

        return (
          <div key={area.id} className="mb-4 rounded-lg p-4 shadow bg-white">
            <button
              onClick={() => toggleAccordion(index)}
              className="flex w-full items-center justify-between text-lg font-medium text-client-primary"
            >
              <span>{area.name}</span>

              <ChevronDown
                className={`transition-transform text-client-accent ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {isOpen && (
              <div className="mt-2 overflow-hidden">
                {areaImages.length > 0 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {areaImages.map((media, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="relative flex-shrink-0 cursor-pointer w-40 h-28"
                        onClick={() => handleImageClick(imgIndex)}
                      >
                        <Image
                          src={media.url}
                          alt={`Imagen de ${area.name}`}
                          fill
                          className="rounded-lg object-cover border border-client-primary"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        media={projectMedia}
        initialIndex={modalImageIndex}
      />
    </div>
  );
}
