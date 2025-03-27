"use client";

import { useCallback } from "react";
import { ChevronDown, SlidersHorizontal, House, Map } from "lucide-react";
import clsx from "clsx";

interface FilterMapControlsProps {
  filterOpen: boolean;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showMap: boolean;
  setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
  totalEntries: number;
}

export default function FilterMapControls({
  filterOpen,
  setFilterOpen,
  showMap,
  setShowMap,
  totalEntries = 0,
}: FilterMapControlsProps) {
  const toggleFilterVisibility = useCallback(() => {
    setFilterOpen((prev) => !prev);
  }, [setFilterOpen]);

  const handleToggleMap = useCallback(() => {
    setShowMap((prev) => !prev);
    setFilterOpen(false);
  }, [setShowMap]);

  return (
    <div className="flex items-center gap-x-2 sm:gap-x-4 mt-4 justify-between">
      <button
        onClick={toggleFilterVisibility}
        className="flex items-center space-x-2 whitespace-nowrap rounded-full bg-transparent border border-client-accent text-client-text hover:bg-client-backgroundLight px-6 py-2 transition-colors"
      >
        <span>Filtro</span>

        <SlidersHorizontal className="w-4 h-4" />

        <ChevronDown
          className={clsx(
            "transition-transform duration-300",
            filterOpen && "rotate-180"
          )}
        />
      </button>

      <p className="text-client-text flex flex-col sm:flex-row items-center">
        <span>{totalEntries}</span>

        <span className="sm:ml-1">resultados</span>
      </p>

      <button
        onClick={handleToggleMap}
        className="flex items-center space-x-2 whitespace-nowrap rounded-full bg-transparent border border-client-accent text-client-text hover:bg-client-backgroundLight px-6 py-2 transition-colors"
      >
        <span>{showMap ? "Propiedades" : "Mapa"}</span>

        {showMap ? <House size={18} /> : <Map size={18} />}
      </button>
    </div>
  );
}
