"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { Plus, Minus, LocateFixed } from "lucide-react";
import { useLoading } from "@/src/providers";
import { useLocationGeocoder } from "@/src/hooks/projects";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DEFAULT_CENTER = { lat: 4.5709, lng: -74.2973 };

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
  iconUrl: markerIcon.src ?? markerIcon,
  shadowUrl: markerShadow.src ?? markerShadow,
});

export interface LocationMapProps {
  showUserLocationButton?: boolean;
  coordinates: { lat: number; lng: number };
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    department?: string;
  }) => void;
  isLoaded: boolean;
  onUpdateAddress?: (address: string) => void;
}

function MapClickHandler({
  onClick,
}: {
  onClick: (coords: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(event) {
      onClick({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });

  return null;
}

export function LocationMapClient({
  coordinates,
  onLocationSelect,
  isLoaded,
  onUpdateAddress,
  showUserLocationButton,
}: LocationMapProps) {
  const [mapCenter, setMapCenter] = useState(coordinates || DEFAULT_CENTER);
  const { showLoader, hideLoader } = useLoading();
  const { resolveLocation } = useLocationGeocoder();
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      showLoader();
      return () => hideLoader();
    }
    return;
  }, [hideLoader, isLoaded, showLoader]);

  useEffect(() => {
    if (coordinates.lat && coordinates.lng) {
      setMapCenter(coordinates);
      mapRef.current?.setView(coordinates, mapRef.current.getZoom() ?? 15);
    }
  }, [coordinates]);

  const markerPosition = useMemo(
    () => (mapCenter.lat && mapCenter.lng ? mapCenter : DEFAULT_CENTER),
    [mapCenter]
  );

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    setMapCenter(coords);
    resolveLocation(coords).then((result) => {
      if (!result) {
        return;
      }

      onLocationSelect({
        lat: coords.lat,
        lng: coords.lng,
        address: result.address,
        city: result.city,
        department: result.department,
      });

      if (onUpdateAddress) {
        onUpdateAddress(result.address);
      }
    });
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
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setMapCenter(userCoords);
          map.setView(userCoords, 16);

          resolveLocation(userCoords).then((result) => {
            if (!result) {
              return;
            }

            onLocationSelect({
              lat: userCoords.lat,
              lng: userCoords.lng,
              address: result.address,
              city: result.city,
              department: result.department,
            });

            if (onUpdateAddress) {
              onUpdateAddress(result.address);
            }
          });
        },
        (error) => {
          console.warn("No se pudo obtener la ubicacion del usuario.", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <MapContainer
        center={mapCenter}
        zoom={15}
        zoomControl={false}
        style={{ width: "100%", height: "100%" }}
        ref={mapRef}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onClick={handleMapClick} />
        <Marker position={markerPosition} />
      </MapContainer>

      <div className="absolute top-4 left-4 z-10 flex flex-col bg-white shadow-lg rounded-md">
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 bg-white text-black border-b border-gray-200 hover:bg-gray-100"
          onClick={handleZoomIn}
        >
          <Plus size={24} />
        </button>

        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 bg-white text-black border-b border-gray-200 hover:bg-gray-100"
          onClick={handleZoomOut}
        >
          <Minus size={24} />
        </button>

        {showUserLocationButton && (
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 bg-white text-gray-700 hover:bg-gray-100"
            onClick={handleGoToUserLocation}
          >
            <LocateFixed size={24} />
          </button>
        )}
      </div>
    </>
  );
}
