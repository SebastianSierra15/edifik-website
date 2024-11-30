"use client";

import { useState } from "react";
import { ProjectMedia } from "@/lib/definitios";

type ProjectPlansProps = {
  projectMedia: ProjectMedia[];
};

export default function ProjectPlans({ projectMedia }: ProjectPlansProps) {
  const plans = projectMedia
    .filter((media) => media.imageType === 1005)
    .map((media) => ({
      label: media.tag,
      image: media.url,
      description: media.description,
    }));

  const [activeTab, setActiveTab] = useState(0);

  if (plans.length === 0) {
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
        {plans.map((plan, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-xl font-semibold transition duration-300 transform ${
              activeTab === index
                ? "text-[#8B4513] hover:scale-105"
                : "text-[#5D4037] hover:text-[#8b45137a] hover:scale-105"
            }`}
          >
            {plan.label}
          </button>
        ))}
      </div>

      {/* Plan Details */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Image */}
        <div className="w-full lg:w-2/3">
          <img
            src={plans[activeTab].image}
            alt={plans[activeTab].label}
            className="rounded-lg w-full"
            style={{
              border: "1px solid #8B4513",
            }}
          />
        </div>

        {/* Description */}
        <div className="w-full lg:w-1/3">
          <h3
            className="text-xl font-bold mb-2"
            style={{
              color: "#5D4037",
            }}
          >
            {plans[activeTab].label}
          </h3>
          <p
            style={{
              color: "#5D4037",
            }}
          >
            {plans[activeTab].description}
          </p>
        </div>
      </div>
    </div>
  );
}
