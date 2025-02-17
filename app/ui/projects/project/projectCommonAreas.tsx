"use client";

import React, { useState } from "react";
import Image from "next/image";
import ImageModal from "./imageModal";
import { CommonArea, ProjectMedia } from "@/lib/definitios";
//import { AiOutlineDown } from "react-icons/ai";
//import { motion } from "framer-motion";

type ProjectCommonAreasProps = {
  areas: CommonArea[];
  projectMedia: ProjectMedia[];
};

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
      <h2 style={{ color: "#8B4513" }} className="mb-4 text-2xl font-semibold">
        Áreas Comunes
      </h2>
      {areas.map((area, index) => {
        const areaImages = projectMedia.filter(
          (media) => media.commonArea === area.id
        );

        const isOpen = openAccordions.includes(index);

        return (
          <div
            key={area.id}
            className="mb-4 rounded-lg p-4 shadow"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="flex w-full items-center justify-between text-lg font-semibold"
              style={{ color: "#5D4037" }}
            >
              <span>{area.name}</span>
              <AiOutlineDown
                className={`transition-transform ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
                style={{ color: "#DAA520" }}
              />
            </button>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isOpen ? 1 : 0,
                height: isOpen ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
              className="mt-2 overflow-hidden"
            >
              {isOpen && areaImages.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {areaImages.map((media, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="flex-shrink-0 cursor-pointer"
                      onClick={() => handleImageClick(imgIndex)}
                      style={{
                        width: "150px",
                        height: "100px",
                      }}
                    >
                      <Image
                        src={media.url}
                        alt={`Imagen de ${area.name}`}
                        width={150}
                        height={100}
                        className="rounded-lg object-cover"
                        style={{
                          objectFit: "cover",
                          border: "2px solid #EDEDED",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
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
