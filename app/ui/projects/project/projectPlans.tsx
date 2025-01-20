"use client";

import { useState } from "react";
import Image from "next/image";
import ImageModal from "./imageModal";
import { ProjectMedia } from "@/lib/definitios";

type ProjectPlansProps = {
  projectMedia: ProjectMedia[];
};

export default function ProjectPlans({ projectMedia }: ProjectPlansProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(0);

  if (projectMedia.length === 0) {
    return (
      <div
        className="rounded-lg p-6"
        style={{
          backgroundColor: "#EDEDED",
          color: "#5D4037",
          border: "1px solid #5D4037",
        }}
      >
        <p>No hay planos disponibles para este proyecto.</p>
      </div>
    );
  }

  return (
    <div
      className="mt-4 rounded-lg p-3"
      style={{
        backgroundColor: "transparent",
        border: "1px solid #5D4037",
      }}
    >
      <div
        className="mb-4 flex space-x-4 border-b-2"
        style={{
          borderColor: "#5D4037",
        }}
      >
        {projectMedia.map((plan, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`transform px-4 py-2 text-xl font-semibold transition duration-300 ${
              activeTab === index
                ? "text-[#8B4513] hover:scale-105"
                : "text-[#5D4037] hover:scale-105 hover:text-[#8b45137a]"
            }`}
          >
            {plan.tag}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4 lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0">
        <div className="w-full lg:w-2/3">
          <div
            className="relative h-96 w-full"
            style={{
              border: "1px solid #8B4513",
            }}
          >
            <Image
              src={projectMedia[activeTab].url}
              alt={projectMedia[activeTab].tag}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
              className="cursor-pointer rounded-lg object-cover"
              onClick={() => {
                setIsModalOpen(true);
                setCurrentImage(activeTab);
              }}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <h3
            className="mb-2 text-xl font-bold"
            style={{
              color: "#5D4037",
            }}
          >
            {projectMedia[activeTab].tag}
          </h3>
          <p
            style={{
              color: "#5D4037",
            }}
          >
            {projectMedia[activeTab].description}
          </p>
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        media={projectMedia}
        initialIndex={currentImage}
      />
    </div>
  );
}
