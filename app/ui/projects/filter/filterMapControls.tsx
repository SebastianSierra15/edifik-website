"use client";

import { useCallback } from "react";
import { ChevronDown, SlidersHorizontal, House, Map } from "lucide-react";
import clsx from "clsx";

type FilterMapControlsProps = {
  filterOpen: boolean;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showMap: boolean;
  setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FilterMapControls({
  filterOpen,
  setFilterOpen,
  showMap,
  setShowMap,
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
      <div className="flex items-center gap-4 px-4 sm:px-20 mt-4 justify-between">
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
      </div>
    </>
  );
}
