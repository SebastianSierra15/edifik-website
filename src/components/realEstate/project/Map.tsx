"use client";

import dynamic from "next/dynamic";
import { Loader } from "@/src/components/shared/Loader";

interface MapProps {
  coordinates: { lat: number; lng: number };
}

const ProjectMapLeaflet = dynamic(
  () => import("./ProjectMapLeaflet").then((mod) => mod.ProjectMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full">
        <Loader size={48} />
      </div>
    ),
  }
);

export function Map({ coordinates }: MapProps) {
  return <ProjectMapLeaflet coordinates={coordinates} />;
}
