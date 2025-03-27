"use client";

import React from "react";
import Map from "@/app/ui/realEstate/project/map";

interface ProjectLocationProps {
  latitude: number;
  longitude: number;
  address: string;
}

export default function ProjectLocation({
  latitude,
  longitude,
  address,
}: ProjectLocationProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold text-white">
        Ubicación del Proyecto
      </h2>

      <p className="mb-6 text-lg text-client-textPlaceholder">
        Explora la ubicación exacta de tu próximo hogar en el mapa interactivo a
        continuación.
      </p>

      <div className="z-10 h-[300px] w-full overflow-hidden rounded-lg border border-white">
        <Map coordinates={{ lat: latitude, lng: longitude }} />
      </div>

      <p className="mt-4 text-xl text-client-text font-medium">{address}</p>
    </div>
  );
}
