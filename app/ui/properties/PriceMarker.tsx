"use client";

import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

type PriceMarkerProps = {
  position: [number, number];
  price: number;
  onClick: () => void;
  isSelected: boolean;
};

export default function PriceMarker({
  position,
  price,
  onClick,
  isSelected,
}: PriceMarkerProps) {
  const map = useMap();

  useEffect(() => {
    const marker = L.marker(position, {
      icon: L.divIcon({
        html: `<button class="text-white font-semibold py-2 px-3 rounded-full shadow-md ${
          isSelected
            ? "bg-primaryDark dark:bg-primaryDark"
            : "bg-primary dark:bg-primary hover:bg-primaryLight focus:outline-none focus:bg-primaryDark dark:focus:bg-primaryDark"
        }">$${price.toLocaleString()}</button>`,
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
        className: "",
      }),
    }).addTo(map);

    marker.on("click", onClick);

    return () => {
      map.removeLayer(marker);
    };
  }, [map, position, price, onClick, isSelected]); // isSelected agregado como dependencia

  return null;
}
