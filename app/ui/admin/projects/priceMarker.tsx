"use client";

import { useEffect } from "react";
//import L from "leaflet";
//import { useMap } from "react-leaflet";

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
            ? "bg-premium-primaryDark dark:bg-premium-primaryDark"
            : "bg-premium-primary dark:bg-premium-primary hover:bg-premium-primaryLight focus:outline-none focus:bg-premium-primaryDark dark:focus:bg-premium-primaryDark"
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
  }, [map, position, price, onClick, isSelected]);

  return null;
}
