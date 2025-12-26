"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { LatLngBounds, Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { Plus, Minus, LocateFixed } from "lucide-react";
import { ProjectSummary } from "@/src/interfaces";
import { ProjectCardAdmin } from "./ProjectCardAdmin";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const DEFAULT_CENTER = { lat: 4.5709, lng: -74.2973 };

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
  iconUrl: markerIcon.src ?? markerIcon,
  shadowUrl: markerShadow.src ?? markerShadow,
});

const createPriceMarkerIcon = (price?: number | null) =>
  L.divIcon({
    className: "bg-transparent border-0 overflow-visible",
    html: `
      <div class="inline-flex w-max items-center justify-center whitespace-nowrap rounded-full bg-premium-primary px-3 py-1 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-premium-primaryDark">
        $${price?.toLocaleString()}
      </div>
    `,
  });

function MapEventHandler({
  onBoundsChange,
  onMapReady,
}: {
  onBoundsChange: (bounds: LatLngBounds) => void;
  onMapReady: (map: LeafletMap) => void;
}) {
  const map = useMapEvents({
    moveend: () => onBoundsChange(map.getBounds()),
    zoomend: () => onBoundsChange(map.getBounds()),
  });

  useEffect(() => {
    onMapReady(map);
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange, onMapReady]);

  return null;
}

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
  const [currentCenter, setCurrentCenter] = useState(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        setCurrentCenter(location);
        setUserLocation(location);
      },
      (error) => {
        console.error(
          "Error obteniendo la ubicacion del usuario:",
          error.message
        );
        setCurrentCenter(DEFAULT_CENTER);
      }
    );
  }, []);

  const validProjects = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      latitude: parseFloat(project.latitude as unknown as string),
      longitude: parseFloat(project.longitude as unknown as string),
    }));
  }, [projects]);

  const handleBoundsChanged = useCallback(
    (bounds: LatLngBounds) => {
      if (!showMap) {
        return;
      }
      setBounds(bounds);
    },
    [setBounds, showMap]
  );

  const handleMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map;
  }, []);

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

  return (
    <>
      <MapContainer
        center={currentCenter}
        zoom={12}
        zoomControl={false}
        style={containerStyle}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEventHandler
          onBoundsChange={handleBoundsChanged}
          onMapReady={handleMapReady}
        />
        {validProjects.map((project) => (
          <Marker
            key={project.id}
            position={{ lat: project.latitude, lng: project.longitude }}
            icon={createPriceMarkerIcon(project.price)}
            eventHandlers={{
              click: () => setSelectedProject(project),
            }}
          />
        ))}
        {userLocation && <Marker position={userLocation} />}
      </MapContainer>

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
              router.push(`/admin/propiedades/${projectId}`)
            }
            onDelete={onDelete}
          />
        </div>
      )}
    </>
  );
}
