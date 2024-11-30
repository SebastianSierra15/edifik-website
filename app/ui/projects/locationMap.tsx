"use client";

import { useEffect } from "react";
import { LatLngTuple, Map as LeafletMap } from "leaflet";
import { useMap, MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const markerIcon = new L.Icon({
  iconUrl: markerIconPng.src,
  shadowUrl: markerShadowPng.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function CenterMap({ coordinates }: { coordinates: LatLngTuple }) {
  const map = useMap();

  useEffect(() => {
    map.setView(coordinates, 13);
  }, [coordinates, map]);

  return null;
}

function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (latlng: LatLngTuple) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (event: L.LeafletMouseEvent) => {
      const latlng: LatLngTuple = [event.latlng.lat, event.latlng.lng];
      onLocationSelect(latlng);
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onLocationSelect]);

  return null;
}

export default function LocationMap({
  coordinates,
  onLocationSelect,
}: {
  coordinates: LatLngTuple;
  onLocationSelect: (coordinates: LatLngTuple) => void;
}) {
  return (
    <div className="w-full h-64">
      <MapContainer
        center={coordinates}
        zoom={13}
        className="w-full h-full z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={coordinates} icon={markerIcon} />
        <LocationMarker onLocationSelect={onLocationSelect} />
        <CenterMap coordinates={coordinates} />
      </MapContainer>
    </div>
  );
}
