"use client";

import { useState, useEffect } from "react";
import { FaFilter, FaChevronDown } from "react-icons/fa";
import { MdMap } from "react-icons/md";
import { BiSolidBuildingHouse } from "react-icons/bi";

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
  const [showMapButton, setShowMapButton] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let scrollThreshold = 550;

      if (window.matchMedia("(min-width: 640px)").matches) {
        scrollThreshold = 400;
      }
      if (window.matchMedia("(min-width: 768px)").matches) {
        scrollThreshold = 300;
      }

      if (showMap) {
        setShowMapButton(true);
        setFilterOpen(false);
      } else {
        if (window.scrollY > scrollThreshold) {
          setShowMapButton(true);
        } else {
          setShowMapButton(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showMap]);

  const handleToggleMap = () => {
    setShowMap((prev) => !prev);
    setIsFilterVisible(false);
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prev) => !prev);
    setFilterOpen((prev) => !prev);
  };

  return (
    <>
      <div
        className={`flex items-center px-4 sm:px-20 gap-4 ${
          showMap ? "justify-end my-4 hidden" : "justify-between mt-4"
        }`}
      >
        <button
          onClick={toggleFilterVisibility}
          className={`flex items-center space-x-2 px-6 py-2 bg-transparent border border-premium-borderColor dark:border-premium-borderColorHover rounded-full hover:bg-premium-backgroundLight dark:hover:bg-premium-backgroundDark transition-colors whitespace-nowrap ${
            showMap ? "hidden" : "block"
          }`}
        >
          <span className="text-premium-textPrimary dark:text-premium-textPrimary">
            Filtro
          </span>
          <FaFilter className="text-premium-textPrimary dark:text-premium-textPrimary" />
          <FaChevronDown
            className={`${
              isFilterVisible ? "rotate-180" : ""
            } transition-transform duration-300 text-premium-textPrimary dark:text-premium-textPrimary`}
          />
        </button>

        <button
          className="flex items-center space-x-2 px-6 py-2 rounded-full bg-transparent border border-premium-borderColor dark:border-premium-borderColorHover hover:bg-premium-backgroundLight dark:hover:bg-premium-backgroundDark transition-colors whitespace-nowrap"
          onClick={handleToggleMap}
        >
          <span className="text-premium-textPrimary dark:text-premium-textPrimary">
            {showMap ? "Propiedades" : "Mapa"}
          </span>
          {showMap ? (
            <BiSolidBuildingHouse
              size={18}
              className="text-premium-textPrimary dark:text-premium-textPrimary"
            />
          ) : (
            <MdMap
              size={18}
              className="text-premium-textPrimary dark:text-premium-textPrimary"
            />
          )}
        </button>
      </div>

      {showMapButton && (
        <button
          className={`fixed px-4 right-6 z-50 py-3 mt-24 text-sm rounded-full bg-premium-background dark:bg-premium-backgroundDark shadow-lg hover:bg-premium-backgroundLight dark:hover:bg-premium-backgroundDark transition-colors border border-premium-borderColor dark:border-premium-borderColorHover flex items-center space-x-2 ${
            showMap ? "bottom-4 lg:top-0 lg:bottom-auto" : "top-6"
          }`}
          onClick={handleToggleMap}
        >
          <span className="text-premium-textPrimary dark:text-premium-textPrimary">
            {showMap ? "Propiedades" : "Mapa"}
          </span>
          {showMap ? (
            <BiSolidBuildingHouse
              size={18}
              className="text-premium-textPrimary dark:text-premium-textPrimary"
            />
          ) : (
            <MdMap
              size={18}
              className="text-premium-textPrimary dark:text-premium-textPrimary"
            />
          )}
        </button>
      )}
    </>
  );
}
