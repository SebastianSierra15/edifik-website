"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LatLngBounds, Map as LeafletMap } from "leaflet";
import { Plus, Minus, LocateFixed } from "lucide-react";
import { ProjectSummary } from "@/src/interfaces";
import { LeafletProjectsMap } from "@/src/components/shared";
import { ProjectCardAdmin } from "./ProjectCardAdmin";

export function ProjectsMap({
  projects,
  setBounds,
  showMap,
  onDelete,
}: {
  projects: ProjectSummary[];
  setBounds: (bounds: LatLngBounds | null) => void;
  showMap: boolean;
  onDelete: (id: number, name: string) => void;
}) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<ProjectSummary | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  const validProjects = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      latitude: parseFloat(project.latitude as unknown as string),
      longitude: parseFloat(project.longitude as unknown as string),
    }));
  }, [projects]);

  const projectById = useMemo(() => {
    return new Map(validProjects.map((project) => [project.id, project]));
  }, [validProjects]);

  const markers = useMemo(
    () =>
      validProjects.map((project) => ({
        id: project.id,
        lat: project.latitude,
        lng: project.longitude,
        price: project.price,
      })),
    [validProjects]
  );

  const handleMarkerClick = (marker: { id: number }) => {
    const selected = projectById.get(marker.id) ?? null;
    setSelectedProject(selected);
  };

  const handleCloseCard = () => {
    setSelectedProject(null);
  };

  const handleZoomIn = () => {
    const map = mapRef.current;
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  const handleGoToUserLocation = () => {
    const map = mapRef.current;
    if (userLocation && map) {
      map.setView(userLocation, 14);
    } else {
      console.warn("No se pudo obtener la ubicacion del usuario.");
    }
  };

  const handleMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map;
  }, []);

  return (
    <>
      <LeafletProjectsMap
        markers={markers}
        setBounds={setBounds}
        showMap={showMap}
        onMarkerClick={handleMarkerClick}
        onMapReady={handleMapReady}
        onUserLocationChange={setUserLocation}
      />

      <div className="absolute top-4 left-4 z-[700] flex flex-col space-y-2">
        <button
          className="flex items-center justify-center w-12 h-12 bg-white text-black border-b border-gray-200 hover:bg-gray-100"
          onClick={handleZoomIn}
        >
          <Plus size={24} />
        </button>

        <button
          className="flex items-center justify-center w-12 h-12 bg-white text-black border-b border-gray-200 hover:bg-gray-100"
          onClick={handleZoomOut}
        >
          <Minus size={24} />
        </button>

        <button
          className="flex items-center justify-center w-12 h-12 bg-white text-gray-700 hover:bg-gray-100"
          onClick={handleGoToUserLocation}
        >
          <LocateFixed size={24} />
        </button>
      </div>

      {selectedProject && (
        <div className="absolute left-1/2 top-1/3 sm:top-4 z-[650] w-72 -translate-x-1/2 transform rounded-lg bg-premium-backgroundLight shadow-lg sm:left-auto sm:right-4 sm:translate-x-0 dark:bg-premium-backgroundDark">
          <ProjectCardAdmin
            id={selectedProject.id}
            images={selectedProject.projectMedia}
            name={selectedProject.name}
            location={selectedProject.city.name}
            price={selectedProject.price || undefined}
            area={selectedProject.totalArea || 0}
            isFromMap={true}
            onClose={handleCloseCard}
            url={`/inmobiliaria/${selectedProject.id}`}
            onEdit={(projectId) =>
              router.push(`/admin/inmobiliaria/${projectId}`)
            }
            onDelete={onDelete}
          />
        </div>
      )}
    </>
  );
}
