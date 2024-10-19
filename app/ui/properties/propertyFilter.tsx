"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import FilterOption from "./filterOption";
import FilterNumericCounter from "./filterNumericCounter";
import FilterOptionWithSlider from "./filterOptionWithSlider";
import {
  FaCity,
  FaBuilding,
  FaHome,
  FaDollarSign,
  FaBed,
  FaToilet,
  FaCouch,
  FaWarehouse,
  FaConciergeBell,
  FaTimes,
  FaCrown,
  FaRulerHorizontal,
} from "react-icons/fa";
import {
  City,
  HousingType,
  PropertyType,
  NearbyService,
  CommonArea,
  MembershipSummary,
} from "@/lib/definitios";

type Category =
  | "cities"
  | "propertyTypes"
  | "housingTypes"
  | "commonAreas"
  | "nearbyServices"
  | "memberships"
  | "rooms"
  | "bathrooms"
  | "lobbies"
  | "price"
  | "area";

type PropertyFilterProps = {
  selectedButtons: Record<Category, number[]>;
  setSelectedButtons: React.Dispatch<
    React.SetStateAction<Record<Category, number[]>>
  >;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  priceRange: { min: number; max: number };
  areaRange: { min: number; max: number };
};

export default function PropertyFilter({
  selectedButtons,
  setSelectedButtons,
  setFilterOpen,
  priceRange,
  areaRange,
}: PropertyFilterProps) {
  const [metadata, setMetadata] = useState({
    cities: [] as City[],
    commonAreas: [] as CommonArea[],
    housingTypes: [] as HousingType[],
    nearbyServices: [] as NearbyService[],
    propertyTypes: [] as PropertyType[],
    memberships: [] as MembershipSummary[],
  });

  const [isOpen, setIsOpen] = useState<Record<Category, boolean>>({
    cities: false,
    propertyTypes: false,
    housingTypes: false,
    commonAreas: false,
    nearbyServices: false,
    memberships: false,
    rooms: false,
    bathrooms: false,
    lobbies: false,
    price: false,
    area: false,
  });

  const [isFixed, setIsFixed] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/properties/metadata");
        setMetadata(response.data);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
    fetchData();
  }, []);

  const toggleOpen = (category: Category) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const [bottomReached, setBottomReached] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const filterTop = filterRef.current?.getBoundingClientRect().top ?? 0;
      const filterBottom =
        filterRef.current?.getBoundingClientRect().bottom ?? 0;
      const scrollY = window.scrollY;
      const bottomOffset = 30;

      if (scrollY >= filterTop + bottomOffset && !bottomReached) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }

      const pageHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      if (windowHeight + scrollY >= pageHeight - 200) {
        setBottomReached(true);
        setIsFixed(false);
      } else {
        setBottomReached(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [bottomReached]);

  const updateFilterValue = (
    category: Category,
    newValue: number | number[]
  ) => {
    setSelectedButtons((prevSelected) => ({
      ...prevSelected,
      [category]: Array.isArray(newValue) ? newValue : [newValue],
    }));
  };

  const changeCount = (
    category: "rooms" | "bathrooms" | "lobbies",
    increment: boolean
  ) => {
    setSelectedButtons((prevSelected) => ({
      ...prevSelected,
      [category]: [
        Math.max(
          1,
          Math.min(prevSelected[category][0] + (increment ? 1 : -1), 3)
        ),
      ],
    }));
  };

  const handleToggleItem = (category: Category, id: number) => {
    setSelectedButtons((prevSelected) => {
      const selectedItems = prevSelected[category];
      return {
        ...prevSelected,
        [category]: selectedItems.includes(id)
          ? selectedItems.filter((itemId) => itemId !== id)
          : [...selectedItems, id],
      };
    });
  };

  const resetFilters = () => {
    setSelectedButtons({
      cities: [],
      propertyTypes: [],
      housingTypes: [],
      commonAreas: [],
      nearbyServices: [],
      memberships: [],
      rooms: [1],
      bathrooms: [1],
      lobbies: [1],
      price: [1],
      area: [1],
    });
  };

  return (
    <div
      ref={filterRef}
      className={`w-full sm:w-72 md:w-80 bg-background dark:bg-darkBackgroundLight shadow-md rounded-lg py-4 transition-all duration-300 ease-in-out ${
        isFixed ? "sticky top-32 lg:top-20 z-10" : ""
      }`}
    >
      <div className="mt-1 space-y-6">
        <div className="flex items-center justify-between rounded-md pl-2 pr-6">
          <button
            onClick={resetFilters}
            className="font-medium text-lg py-1 px-4 text-textPrimary dark:text-darkTextPrimary transition-transform duration-200 transform hover:scale-110 hover:font-semibold"
          >
            Borrar filtros
          </button>
          <div
            className="flex items-center cursor-pointer text-textPrimary dark:text-darkTextPrimary"
            onClick={() => setFilterOpen((prev) => !prev)}
          >
            <FaTimes className="transition-transform duration-200 transform hover:scale-125" />
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-600" />

        {/* Contenedor con scroll vertical y sin scroll horizontal */}
        <div className="space-y-4 px-3 py-1 sm:max-h-[65vh] sm:overflow-y-auto overflow-x-hidden">
          {/* Filter options */}
          {[
            {
              label: "Ciudades",
              icon: <FaCity />,
              items: metadata.cities,
              category: "cities" as Category,
            },
            {
              label: "Tipos de Inmueble",
              icon: <FaBuilding />,
              items: metadata.propertyTypes,
              category: "propertyTypes" as Category,
            },
            {
              label: "Tipos de Vivienda",
              icon: <FaHome />,
              items: metadata.housingTypes,
              category: "housingTypes" as Category,
            },
            {
              label: "Áreas Comunes",
              icon: <FaWarehouse />,
              items: metadata.commonAreas,
              category: "commonAreas" as Category,
            },
            {
              label: "Servicios Cercanos",
              icon: <FaConciergeBell />,
              items: metadata.nearbyServices,
              category: "nearbyServices" as Category,
            },
            {
              label: "Membresía",
              icon: <FaCrown />,
              items: metadata.memberships,
              category: "memberships" as Category,
            },
          ].map(({ label, icon, items, category }) => (
            <FilterOption
              key={category}
              label={label}
              icon={icon}
              items={items}
              selectedItems={selectedButtons[category]}
              onToggleItem={(id) => handleToggleItem(category, id)}
              isOpen={isOpen[category]}
              onToggleOpen={() => toggleOpen(category)}
            />
          ))}

          {/* Price and Area Sliders */}
          {[
            {
              label: "Precio",
              icon: <FaDollarSign />,
              value: selectedButtons.price[0] || 0,
              min: priceRange.min || 0,
              max: priceRange.max || 0,
              step: 100000,
              category: "price" as Category,
              prefixText: "Desde $",
              suffixText: "COP",
            },
            {
              label: "Área",
              icon: <FaRulerHorizontal />,
              value: selectedButtons.area[0] || 0,
              min: areaRange.min || 0,
              max: areaRange.max || 0,
              step: 100,
              category: "area" as Category,
              prefixText: "Desde",
              suffixText: "m²",
            },
          ].map(
            ({
              label,
              icon,
              value,
              min,
              max,
              step,
              category,
              prefixText,
              suffixText,
            }) => (
              <FilterOptionWithSlider
                key={category}
                label={label}
                icon={icon}
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={(newValue) => updateFilterValue(category, newValue)}
                isOpen={isOpen[category]}
                setIsOpen={() => toggleOpen(category)}
                prefixText={prefixText}
                suffixText={suffixText}
              />
            )
          )}

          {/* Numeric Counters */}
          {[
            {
              label: "Nº de habitaciones",
              icon: <FaBed />,
              category: "rooms" as "rooms" | "bathrooms" | "lobbies",
            },
            {
              label: "Nº de baños",
              icon: <FaToilet />,
              category: "bathrooms" as "rooms" | "bathrooms" | "lobbies",
            },
            {
              label: "Nº de salas de estar",
              icon: <FaCouch />,
              category: "lobbies" as "rooms" | "bathrooms" | "lobbies",
            },
          ].map(({ label, icon, category }) => (
            <FilterNumericCounter
              key={category}
              label={label}
              icon={icon}
              isOpen={isOpen[category]}
              setIsOpen={() => toggleOpen(category)}
              value={selectedButtons[category][0]}
              increment={() => changeCount(category, true)}
              decrement={() => changeCount(category, false)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
