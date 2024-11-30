"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { ProjectSummary } from "@/lib/definitios";
import ProjectCard from "./projectCard";
import PriceMarker from "./PriceMarker";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

type ProjectsMapProps = {
  projects: ProjectSummary[];
};

export default function ProjectsMap({ projects }: ProjectsMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectSummary | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const center: [number, number] = [4.5709, -74.2973];

  const handleCloseCard = () => {
    setSelectedProject(null);
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        key={projects.length}
        center={center}
        zoom={7}
        minZoom={4}
        className="w-full h-full relative z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {projects.map((project) => (
          <PriceMarker
            key={project.id}
            position={[project.latitude, project.longitude]}
            price={project.price}
            onClick={() => setSelectedProject(project)}
            isSelected={selectedProject?.id === project.id}
          />
        ))}
      </MapContainer>

      {selectedProject && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-50 bg-backgroundLight dark:bg-backgroundDark shadow-lg rounded-lg w-72">
          <ProjectCard
            images={[
              "/images/image2.jpg",
              "/images/image3.jpg",
              "/images/image4.jpg",
            ]}
            name={selectedProject.name}
            location={`${selectedProject.city.name}, ${selectedProject.city.departament.name}`}
            price={selectedProject.price}
            area={0}
            idMembership={selectedProject.membership}
            isFromMap={true}
            showActions={true}
            onClose={handleCloseCard}
            url={`/admin/propiedades/${selectedProject.id}`}
          />
        </div>
      )}
    </div>
  );
}
