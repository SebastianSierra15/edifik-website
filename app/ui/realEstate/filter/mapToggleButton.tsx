"use client";

import { House, Map } from "lucide-react";

interface MapToggleButtonProps {
  showMap: boolean;
  setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MapToggleButton({
  showMap,
  setShowMap,
}: MapToggleButtonProps) {
  const handleClick = () => {
    setShowMap((prev) => !prev);
  };

  return (
    showMap && (
      <button
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-2 rounded-full border border-client-secondary bg-client-background px-4 py-3 text-sm shadow-lg transition-colors hover:bg-client-background-light"
        onClick={handleClick}
      >
        <span className="text-client-text">
          {showMap ? "Propiedades" : "Mapa"}
        </span>
        {showMap ? (
          <House size={18} className="text-client-text" />
        ) : (
          <Map size={18} className="text-client-text" />
        )}
      </button>
    )
  );
}
