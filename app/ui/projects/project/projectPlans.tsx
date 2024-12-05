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
        className="p-6 rounded-lg"
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
      className="p-3 rounded-lg mt-8"
      style={{
        backgroundColor: "transparent",
        border: "1px solid #5D4037",
      }}
    >
      {/* Tabs */}
      <div
        className="flex space-x-4 border-b-2 mb-4"
        style={{
          borderColor: "#5D4037",
        }}
      >
        {projectMedia.map((plan, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-xl font-semibold transition duration-300 transform ${
              activeTab === index
                ? "text-[#8B4513] hover:scale-105"
                : "text-[#5D4037] hover:text-[#8b45137a] hover:scale-105"
            }`}
          >
            {plan.tag}
          </button>
        ))}
      </div>

      {/* Plan Details */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Image */}
        <div className="w-full lg:w-2/3">
          <div
            className="relative w-full h-96"
            style={{
              border: "1px solid #8B4513",
            }}
          >
            <Image
              src={projectMedia[activeTab].url}
              alt={projectMedia[activeTab].tag}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
              className="rounded-lg object-cover cursor-pointer"
              onClick={() => {
                setIsModalOpen(true);
                setCurrentImage(activeTab);
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="w-full lg:w-1/3">
          <h3
            className="text-xl font-bold mb-2"
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
