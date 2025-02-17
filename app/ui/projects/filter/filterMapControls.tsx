"use client";

import { useCallback } from "react";
import { ChevronDown, SlidersHorizontal, House, Map } from "lucide-react";
import clsx from "clsx";

type FilterMapControlsProps = {
  isProperty: boolean;
  filterOpen: boolean;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showMap: boolean;
  setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
  totalEntries: number;
};

export default function FilterMapControls({
  isProperty,
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
    <>
      <div className="flex items-center gap-x-2 sm:gap-x-4 mt-4 justify-between">
        <button
          onClick={toggleFilterVisibility}
          className="flex items-center space-x-2 whitespace-nowrap rounded-full border border-premium-borderColor bg-transparent px-6 py-2 transition-colors hover:bg-premium-backgroundLight dark:border-premium-borderColorHover dark:hover:bg-premium-backgroundDark"
        >
          <span className="text-premium-textPrimary dark:text-premium-textPrimary">
            Filtro
          </span>
          <SlidersHorizontal className="w-4 h-4 text-premium-textPrimary dark:text-premium-textPrimary" />
          <ChevronDown
            className={clsx(
              "text-premium-textPrimary transition-transform duration-300 dark:text-premium-textPrimary",
              filterOpen && "rotate-180"
            )}
          />
        </button>

        <label className="text-premium-textPrimary dark:text-premium-textPrimary flex flex-col sm:flex-row items-center">
          <span>{totalEntries}</span>
          <span className="sm:ml-1">resultados</span>
        </label>

        {isProperty && (
          <button
            onClick={handleToggleMap}
            className="flex items-center space-x-2 whitespace-nowrap rounded-full border border-premium-borderColor bg-transparent px-6 py-2 transition-colors hover:bg-premium-backgroundLight dark:border-premium-borderColorHover dark:hover:bg-premium-backgroundDark"
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
        )}
      </div>
    </>
  );
}
