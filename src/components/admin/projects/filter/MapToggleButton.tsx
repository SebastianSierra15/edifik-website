"use client";

import { House, Map } from "lucide-react";

interface MapToggleButtonProps {
  showMap: boolean;
  setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MapToggleButton({
  showMap,
  setShowMap,
}: MapToggleButtonProps) {
  const handleClick = () => {
    setShowMap((prev) => !prev);
  };

  return (
    showMap && (
      <button
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-2 rounded-full border border-premium-borderColor bg-premium-background px-4 py-3 text-sm shadow-lg transition-colors hover:bg-premium-backgroundLight dark:border-premium-borderColorHover dark:bg-premium-backgroundLigth dark:hover:bg-premium-backgroundDark"
        onClick={handleClick}
      >
        <span className="text-premium-textPrimary dark:text-premium-textPrimary">
          {showMap ? "Propiedades" : "Mapa"}
        </span>
        {showMap ? (
          <House
            size={18}
            className="text-premium-textPrimary dark:text-premium-textPrimary"
          />
        ) : (
          <Map
            size={18}
            className="text-premium-textPrimary dark:text-premium-textPrimary"
          />
        )}
      </button>
    )
  );
}
