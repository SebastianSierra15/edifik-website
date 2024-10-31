"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

type MapProps = {
  latitude: number;
  longitude: number;
};

export default function Map({ latitude, longitude }: MapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([latitude, longitude], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return <div ref={mapRef} className="w-full h-64" />;
}
