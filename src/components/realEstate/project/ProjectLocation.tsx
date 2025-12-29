"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@/src/components/shared/Loader";
import { Map } from "./Map";

interface ProjectLocationProps {
  latitude: number;
  longitude: number;
  address: string;
}

export function ProjectLocation({
  latitude,
  longitude,
  address,
}: ProjectLocationProps) {
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);

  useEffect(() => {
    if (!mapWrapperRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(mapWrapperRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pb-4">
      <h2 className="mb-4 text-2xl font-semibold text-white">
        Ubicación del Proyecto
      </h2>

      <p className="mb-6 text-lg text-client-textSecondary">
        Explora la ubicación exacta de tu próximo hogar en el mapa interactivo a
        continuación.
      </p>

      <div
        ref={mapWrapperRef}
        className="z-10 h-[300px] w-full overflow-hidden rounded-lg border border-white"
      >
        {isMapVisible ? (
          <Map coordinates={{ lat: latitude, lng: longitude }} />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Loader size={48} />
          </div>
        )}
      </div>

      <p className="mt-2 text-lg text-client-text font-medium">{address}</p>
    </div>
  );
}
