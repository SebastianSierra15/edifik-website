"use client";

import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Plus, Minus, LocateFixed } from "lucide-react";
import Loader from "../loader";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const DEFAULT_CENTER = { lat: 4.5709, lng: -74.2973 };

export default function LocationMap({
  coordinates,
  onLocationSelect,
  isLoaded,
  onUpdateAddress,
}: {
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
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (
      coordinates.lat !== DEFAULT_CENTER.lat &&
      coordinates.lng !== DEFAULT_CENTER.lng
    ) {
      setMapCenter(coordinates);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userCoords);
          setMapCenter(userCoords);
        },
        () => {
          setMapCenter(DEFAULT_CENTER);
        }
      );
    } else {
      setMapCenter(DEFAULT_CENTER);
    }
  }, [coordinates]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    if (coordinates.lat && coordinates.lng) {
      map.panTo({ lat: coordinates.lat, lng: coordinates.lng });
      map.setZoom(15);
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newCoordinates = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      setMapCenter(newCoordinates);
      setUserLocation(null);

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newCoordinates }, (results, status) => {
        if (
          status === google.maps.GeocoderStatus.OK &&
          results !== null &&
          results.length > 0
        ) {
          const formattedAddress = results[0].formatted_address;
          const foundCity = results.find((result) =>
            result.types.includes("locality")
          );
          const foundDepartment = results.find((result) =>
            result.types.includes("administrative_area_level_1")
          );

          const cityName =
            foundCity?.formatted_address.split(",")[0].trim() || "";
          const departmentName =
            foundDepartment?.formatted_address.split(",")[0].trim() || "";

          onLocationSelect({
            lat: newCoordinates.lat,
            lng: newCoordinates.lng,
            address: formattedAddress,
            city: cityName,
            department: departmentName,
          });

          if (onUpdateAddress) {
            onUpdateAddress(formattedAddress);
          }
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
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserLocation(userCoords);
          setMapCenter(userCoords);
          map.panTo(userCoords);
          map.setZoom(16);

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: userCoords }, (results, status) => {
            if (
              status === google.maps.GeocoderStatus.OK &&
              results !== null &&
              results.length > 0
            ) {
              const formattedAddress = results[0].formatted_address;
              const foundCity = results.find((result) =>
                result.types.includes("locality")
              );
              const foundDepartment = results.find((result) =>
                result.types.includes("administrative_area_level_1")
              );

              const cityName =
                foundCity?.formatted_address.split(",")[0].trim() || "";
              const departmentName =
                foundDepartment?.formatted_address.split(",")[0].trim() || "";

              onLocationSelect({
                lat: userCoords.lat,
                lng: userCoords.lng,
                address: formattedAddress,
                city: cityName,
                department: departmentName,
              });

              if (onUpdateAddress) {
                onUpdateAddress(formattedAddress);
              }
            }
          });
        },
        (error) => {
          console.warn("No se pudo obtener la ubicación del usuario.", error);
        }
      );
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
        }}
      >
        <Marker position={coordinates} />

        {userLocation && <Marker position={userLocation} />}
      </GoogleMap>

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

        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 bg-white text-gray-700 hover:bg-gray-100"
          onClick={handleGoToUserLocation}
        >
          <LocateFixed size={24} />
        </button>
      </div>
    </>
  );
}
