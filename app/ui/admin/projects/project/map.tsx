"use client";

import { useEffect, useState, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";
import Loader from "../../../loader";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function ProjectLocationMap({
  coordinates,
  address,
  isLoaded,
}: {
  coordinates: { lat: number; lng: number };
  address: string;
  isLoaded: boolean;
}) {
  const [mapCenter] = useState(coordinates);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  useEffect(() => {
    async function setMarker() {
      if (isLoaded && mapRef.current) {
        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
          "marker"
        )) as any;

        if (markerRef.current) {
          markerRef.current.map = null;
        }

        if (coordinates.lat && coordinates.lng) {
          markerRef.current = new AdvancedMarkerElement({
            position: coordinates,
            map: mapRef.current,
            title: "Ubicación del Proyecto",
          });
          mapRef.current.panTo(coordinates);
        }
      }
    }
    setMarker();
  }, [isLoaded, coordinates]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (coordinates.lat && coordinates.lng) {
      map.panTo(coordinates);
      map.setZoom(15);
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
    <div className="my-10">
      <h2 className="mb-4 text-2xl font-semibold" style={{ color: "#8B4513" }}>
        Ubicación del Proyecto
      </h2>
      <p className="mb-6 text-lg" style={{ color: "#5D4037" }}>
        Explora la ubicación exacta de tu próximo hogar en el mapa interactivo a
        continuación.
      </p>

      <div
        className="z-10 h-[300px] w-full overflow-hidden rounded-lg"
        style={{
          border: "1px solid #5D4037",
          borderColor: "#DAA520",
        }}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={15}
          onLoad={handleMapLoad}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            draggable: false,
            clickableIcons: false,
            keyboardShortcuts: false,
            mapTypeId: "roadmap",
            mapId: "78a223abe416be2b",
          }}
        />
      </div>

      <p className="mt-4 text-lg" style={{ color: "#5D4037" }}>
        {address}
      </p>
    </div>
  );
}
