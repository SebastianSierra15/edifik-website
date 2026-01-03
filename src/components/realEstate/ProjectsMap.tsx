"use client";

import dynamic from "next/dynamic";
import { Loader } from "@/src/components/shared";
import type { ProjectView } from "@/src/interfaces";
import type { LatLngBounds } from "leaflet";

interface ProjectsMapProps {
  projects: ProjectView[];
  setBounds: (bounds: LatLngBounds | null) => void;
  showMap: boolean;
  highlightCoords?: { latitude: number; longitude: number } | null;
}

const ProjectsMapLeaflet = dynamic(
  () => import("./ProjectsMapLeaflet").then((mod) => mod.ProjectsMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center w-full h-full">
        <Loader size={48} />
      </div>
    ),
  }
);

export function ProjectsMap(props: ProjectsMapProps) {
  return <ProjectsMapLeaflet {...props} />;
}
