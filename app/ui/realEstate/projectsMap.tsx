"use client";

import { memo, useMemo, useState, useEffect, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { Plus, Minus, LocateFixed } from "lucide-react";
import { ProjectView } from "@/lib/definitios";
import PropertyCard from "./PropertyCard";
import Loader from "../loader";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const DEFAULT_CENTER = { lat: 4.5709, lng: -74.2973 };

export default function ProjectsMap({
  projects,
  setBounds,
  showMap,
  highlightCoords,
}: {
  projects: ProjectView[];
  setBounds: (bounds: google.maps.LatLngBounds | null) => void;
  showMap: boolean;
  highlightCoords?: { latitude: number; longitude: number } | null;
}) {
  const [selectedProject, setSelectedProject] = useState<ProjectView | null>(
    null
  );
  const mapRef = useRef<google.maps.Map | null>(null);
  let [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [locationMarker, setLocationMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const isMapsReady = typeof window !== "undefined" && !!window.google?.maps;

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
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (mapRef.current) {
          updateLocationMarker(mapRef.current, location);
        }
      },
      (error) => {
        console.error(
          "Error obteniendo la ubicación del usuario:",
          error.message
        );
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
    if (mapRef.current && isMapsReady) {
      clearMarkers();
      addMarkers(mapRef.current);
    }
  }, [validProjects, isMapsReady, isMapLoaded, highlightCoords]);

  useEffect(() => {
    if (!highlightCoords || !mapRef.current || !isMapLoaded) return;

    const map = mapRef.current;

    const waitForMapToRender = () => {
      const container = map.getDiv();
      const isVisible =
        container.offsetWidth > 0 &&
        container.offsetHeight > 0 &&
        container.getClientRects().length > 0;

      if (isVisible) {
        updateLocationMarker(map, highlightCoords);
      } else {
        setTimeout(waitForMapToRender, 100);
      }
    };

    waitForMapToRender();
  }, [highlightCoords, isMapLoaded]);

  useEffect(() => {
    if (highlightCoords && mapRef.current) {
      updateLocationMarker(mapRef.current, highlightCoords);
    }
  }, [highlightCoords]);

  const clearMarkers = () => {
    markers.forEach((marker) => {
      marker.map = null;
      marker.element?.remove();
    });
    setMarkers([]);
  };

  const updateLocationMarker = (
    map: google.maps.Map,
    coords:
      | { lat: number; lng: number }
      | { latitude: number; longitude: number }
  ) => {
    const { AdvancedMarkerElement } = google.maps.marker;

    const lat = "lat" in coords ? coords.lat : coords.latitude;
    const lng = "lng" in coords ? coords.lng : coords.longitude;
    const position = { lat, lng };

    map.setCenter(position);
    map.setZoom(14);

    window.google.maps.event.trigger(map, "idle");

    if (locationMarker) {
      locationMarker.position = position;
      locationMarker.map = map;
    } else {
      const marker = new AdvancedMarkerElement({
        position,
        map,
      });
      setLocationMarker(marker);
    }
  };

  const addMarkers = (map: google.maps.Map) => {
    clearMarkers();
    const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

    validProjects.forEach((project) => {
      const contentDiv = document.createElement("div");
      contentDiv.innerHTML = `
     <div class="bg-client-accent hover:bg-client-accentHover border border-client-textSecondary hover:scale-105 focus:scale-105 focus:bg-client-accentLight text-client-white font-semibold py-1 px-3 rounded-full text-sm transition-all duration-300 ease-in-out">
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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (mapRef.current) {
          updateLocationMarker(mapRef.current, coords);
        }
      },
      (error) => {
        console.warn("No se pudo obtener la ubicación del usuario.");
      }
    );
  };

  if (!isMapsReady) {
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
        zoom={12}
        onLoad={(map) => {
          mapRef.current = map;
          setIsMapLoaded(true);
          map.setCenter(DEFAULT_CENTER);
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
        <div className="absolute left-1/2 top-1/3 sm:top-4 z-20 w-72 -translate-x-1/2 transform rounded-lg shadow-lg sm:left-auto sm:right-4 sm:translate-x-0">
          <PropertyCard
            id={selectedProject.id}
            name={selectedProject.name}
            location={selectedProject.cityName}
            images={selectedProject.images}
            price={selectedProject.price || undefined}
            area={selectedProject.area || 0}
            bedrooms={selectedProject.bedrooms}
            bathrooms={selectedProject.bathrooms}
            parkingSpots={selectedProject.parkingSpots}
            url={`/inmobiliaria`}
            isFromMap={true}
            onClose={handleCloseCard}
          />
        </div>
      )}
    </>
  );
}
