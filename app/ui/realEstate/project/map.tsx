"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { GoogleMap } from "@react-google-maps/api";
import Loader from "../../loader";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function Map({
  coordinates,
}: {
  coordinates: { lat: number; lng: number };
}) {
  const isMapsReady = typeof window !== "undefined" && !!window.google?.maps;

  const [mapCenter, setMapCenter] = useState(coordinates);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  const setMarker = async () => {
    if (!isMapsReady || !mapRef.current || !google?.maps) {
      return;
    }

    try {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker"
      )) as any;

      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }

      markerRef.current = new AdvancedMarkerElement({
        position: coordinates,
        map: mapRef.current,
        title: "Ubicación del Proyecto",
      });

      mapRef.current.panTo(coordinates);
    } catch (error) {
      console.error("❌ Error al crear el marcador:", error);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      setMarker();
    }
  }, [isMapsReady, coordinates, mapRef.current]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    map.setCenter(coordinates);
    map.setZoom(15);

    setMarker();
  };

  if (!isMapsReady) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader size={48} />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={15}
      onLoad={handleMapLoad}
      options={{
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        draggable: true,
        clickableIcons: true,
        keyboardShortcuts: true,
        mapTypeId: "roadmap",
        mapId: "78a223abe416be2b",
      }}
    />
  );
}
