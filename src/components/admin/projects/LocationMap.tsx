"use client";

import { useEffect, useState, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { Plus, Minus, LocateFixed } from "lucide-react";
import { useLoading } from "@/src/providers";
import { useLocationGeocoder } from "@/src/hooks/projects";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const DEFAULT_CENTER = { lat: 4.5709, lng: -74.2973 };

export function LocationMap({
  coordinates,
  onLocationSelect,
  isLoaded,
  onUpdateAddress,
  showUserLocationButton,
}: {
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
}) {
  const [mapCenter, setMapCenter] = useState(coordinates || DEFAULT_CENTER);
  const { showLoader, hideLoader } = useLoading();
  const { resolveLocation } = useLocationGeocoder();

  const mapRef = useRef<google.maps.Map | null>(null);

  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  useEffect(() => {
    async function updateMarkers() {
      if (isLoaded && mapRef.current) {
        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
          "marker"
        )) as any;

        if (markerRef.current) {
          markerRef.current.map = null;
          markerRef.current = null;
        }

        if (coordinates.lat && coordinates.lng) {
          markerRef.current = new AdvancedMarkerElement({
            position: coordinates,
            map: mapRef.current,
            title: "Ubicación seleccionada",
          });

          mapRef.current.panTo(coordinates);
        }
      }
    }

    updateMarkers();
  }, [isLoaded, coordinates]);

  useEffect(() => {
    if (!isLoaded) {
      showLoader();
      return () => hideLoader();
    }

    return;
  }, [hideLoader, isLoaded, showLoader]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    if (coordinates.lat && coordinates.lng) {
      map.panTo(coordinates);
      map.setZoom(15);

      if (!markerRef.current) {
        google.maps
          .importLibrary("marker")
          .then(({ AdvancedMarkerElement }: any) => {
            markerRef.current = new AdvancedMarkerElement({
              position: coordinates,
              map,
              title: "Ubicación seleccionada",
            });
          });
      }
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newCoordinates = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
        userMarkerRef.current = null;
      }

      setMapCenter(newCoordinates);

      resolveLocation(newCoordinates).then((result) => {
        if (!result) {
          return;
        }

        onLocationSelect({
          lat: newCoordinates.lat,
          lng: newCoordinates.lng,
          address: result.address,
          city: result.city,
          department: result.department,
        });

        if (onUpdateAddress) {
          onUpdateAddress(result.address);
        }
      });
    }
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
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setMapCenter(userCoords);
          map.panTo(userCoords);
          map.setZoom(16);

          const { AdvancedMarkerElement } = (await google.maps.importLibrary(
            "marker"
          )) as any;

          if (userMarkerRef.current) {
            userMarkerRef.current.map = null;
          }

          userMarkerRef.current = new AdvancedMarkerElement({
            position: userCoords,
            map: map,
          });

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
          console.warn("No se pudo obtener la ubicación del usuario.", error);
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
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={15}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          mapTypeId: "roadmap",
          mapId: "78a223abe416be2b",
        }}
      />

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
