"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProjectMedia } from "@/src/interfaces";
import { ImageModal } from "@/src/components/realEstate";

interface ProjectPlansProps {
  projectMedia: ProjectMedia[];
}

export function ProjectPlans({ projectMedia }: ProjectPlansProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mt-4 rounded-lg p-3 bg-client-backgroundAlt border border-client-accent">
      <div className="mb-4 flex space-x-4 border-b-2 border-b-client-accent text-white">
        {projectMedia.map((plan, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`transform px-4 py-2 text-xl font-semibold transition duration-300 ${
              activeTab === index
                ? "text-white hover:scale-105"
                : "text-client-secondary hover:scale-105 hover:text-client-textSecondary"
            }`}
          >
            {plan.tag}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4 lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0">
        <div className="w-full lg:w-2/3 relative h-96 ">
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

        <div className="w-full lg:w-1/3">
          <h3 className="mb-2 text-xl font-medium text-white">
            {projectMedia[activeTab].tag}
          </h3>

          <p className="text-client-textPlaceholder">
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
