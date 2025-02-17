"use client";

import { memo, useMemo, useState, useEffect, useRef } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { Plus, Minus, LocateFixed } from "lucide-react";
import { ProjectSummary } from "@/lib/definitios";
import ProjectCard from "./projectCard";
import Loader from "../loader";

const GOOGLE_MAPS_LIBRARIES: ("places" | "marker")[] = ["places", "marker"];

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const DEFAULT_CENTER = { lat: 4.5709, lng: -74.2973 };

const ProjectsMap = ({
  projects,
  setBounds,
  showMap,
  onDelete,
}: {
  projects: ProjectSummary[];
  setBounds: (bounds: google.maps.LatLngBounds | null) => void;
  showMap: boolean;
  onDelete: (id: number, name: string) => void;
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectSummary | null>(
    null
  );
  const [currentCenter, setCurrentCenter] = useState(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  let [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const handleBoundsChanged = () => {
    if (!showMap) {
      return;
    }

    if (mapRef.current) {
      const newBounds = mapRef.current.getBounds();
      if (newBounds) {
        setBounds(newBounds);
      }
    }
  };

  const handleCloseCard = () => {
    setSelectedProject(null);
  };

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
          "Error obteniendo la ubicación del usuario:",
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

  useEffect(() => {
    if (mapRef.current && isLoaded) {
      clearMarkers();
      addMarkers(mapRef.current);
    }
  }, [validProjects, userLocation, isLoaded, isMapLoaded]);

  const clearMarkers = () => {
    markers.forEach((marker) => {
      marker.map = null;
      marker.element?.remove();
    });
    setMarkers([]);
  };

  const addMarkers = (map: google.maps.Map) => {
    clearMarkers();
    const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

    validProjects.forEach((project) => {
      const contentDiv = document.createElement("div");
      contentDiv.innerHTML = `
      <div class="bg-premium-primary hover:bg-premium-primaryDark hover:scale-105 focus:scale-105 focus:bg-premium-primaryDark text-white font-semibold py-1 px-3 rounded-full text-sm transition-all duration-300 ease-in-out">
        $${project.price?.toLocaleString()}
      </div>
    `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: project.latitude, lng: project.longitude },
        map,
        content: contentDiv,
      });

      marker.addListener("click", () => {
        setSelectedProject(project);
      });

      newMarkers.push(marker);
    });

    if (userLocation) {
      const { AdvancedMarkerElement } = google.maps.marker;

      markers.forEach((marker) => {
        const markerLat =
          typeof marker.position?.lat === "function"
            ? marker.position.lat()
            : marker.position?.lat;
        const markerLng =
          typeof marker.position?.lng === "function"
            ? marker.position.lng()
            : marker.position?.lng;

        if (markerLat === userLocation.lat && markerLng === userLocation.lng) {
          marker.map = null;
        }
      });

      const userMarker = new AdvancedMarkerElement({
        position: userLocation,
        map,
      });

      newMarkers.push(userMarker);
    }

    setMarkers((prev) => [...prev, ...newMarkers]);
  };

  const handleZoomIn = () => {
    const map = mapRef.current;
    if (map) {
      map.setZoom(map.getZoom()! + 1);
    }
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (map) {
      map.setZoom(map.getZoom()! - 1);
    }
  };

  const handleGoToUserLocation = () => {
    const map = mapRef.current;
    if (userLocation && map) {
      map.panTo(userLocation);
      map.setZoom(14);
    } else {
      console.warn("No se pudo obtener la ubicación del usuario.");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader size={48} />
      </div>
    );
  }

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentCenter}
        zoom={12}
        onLoad={(map) => {
          mapRef.current = map;
          setIsMapLoaded(true);
          setTimeout(() => handleBoundsChanged(), 500);
        }}
        onBoundsChanged={handleBoundsChanged}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          mapTypeId: "roadmap",
          mapId: "78a223abe416be2b",
        }}
      />

      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
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
        <div className="absolute left-1/2 top-1/3 sm:top-4 z-20 w-72 -translate-x-1/2 transform rounded-lg bg-premium-backgroundLight shadow-lg sm:left-auto sm:right-4 sm:translate-x-0 dark:bg-premium-backgroundDark">
          <ProjectCard
            id={selectedProject.id}
            images={selectedProject.projectMedia}
            name={selectedProject.name}
            location={selectedProject.city.name}
            price={selectedProject.price || undefined}
            area={selectedProject.totalArea || 0}
            isFromMap={true}
            showActions={false}
            onClose={handleCloseCard}
            url={`/inmobiliaria/${selectedProject.id}`}
            urlEdit={`/admin/propiedades/${selectedProject.id}`}
            onDelete={onDelete}
          />
        </div>
      )}
    </>
  );
};

export default memo(ProjectsMap);
