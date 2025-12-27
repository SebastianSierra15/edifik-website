"use client";

import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import {
  Bed,
  Building,
  Building2,
  ConciergeBell,
  Crown,
  DollarSign,
  House,
  Ruler,
  Sofa,
  Toilet,
  Warehouse,
  X,
} from "lucide-react";
import type { ProjectsMetadata } from "@/src/interfaces";
import {
  FilterOption,
  FilterNumericCounter,
  FilterOptionWithSlider,
  FilterSkeleton,
} from "@src/components/admin";

type Category =
  | "cities"
  | "propertyTypes"
  | "housingTypes"
  | "commonAreas"
  | "nearbyServices"
  | "memberships"
  | "bedrooms"
  | "bathrooms"
  | "lobbies"
  | "price"
  | "area";

interface ProjectFilterProps {
  isProperty: boolean;
  selectedButtons: Record<Category, number[]>;
  setSelectedButtons: React.Dispatch<
    React.SetStateAction<Record<Category, number[]>>
  >;
  setFilterOpen: (open: boolean) => void;
  priceRange: { min: number; max: number };
  areaRange: { min: number; max: number };
  metadata: ProjectsMetadata;
  isLoading: boolean;
}

export function ProjectFilter({
  isProperty,
  selectedButtons,
  setSelectedButtons,
  setFilterOpen,
  priceRange,
  areaRange,
  metadata,
  isLoading,
}: ProjectFilterProps) {
  const [isOpen, setIsOpen] = useState<Record<Category, boolean>>({
    cities: false,
    propertyTypes: false,
    housingTypes: false,
    commonAreas: false,
    nearbyServices: false,
    memberships: false,
    bedrooms: false,
    bathrooms: false,
    lobbies: false,
    price: false,
    area: false,
  });

  const [isFixed, setIsFixed] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const toggleOpen = (category: Category) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      const rect = filterRef.current?.getBoundingClientRect();
      const filterTop = rect ? rect.top : 0;
      const scrollY = window.scrollY;
      const bottomOffset = 30;

      const pageHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const atBottom = windowHeight + scrollY >= pageHeight - 200;

      setIsFixed(scrollY >= filterTop + bottomOffset && !atBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getSelectedItems = (category: Category) =>
    selectedButtons[category] ?? [];
  const getSelectedValue = (category: Category, fallback = 0) =>
    selectedButtons[category]?.[0] ?? fallback;

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
    category: "bedrooms" | "bathrooms" | "lobbies",
    increment: boolean
  ) => {
    setSelectedButtons((prevSelected) => {
      const currentValue = prevSelected[category]?.[0] ?? 0;
      return {
        ...prevSelected,
        [category]: [
          Math.max(0, Math.min(currentValue + (increment ? 1 : -1), 3)),
        ],
      };
    });
  };

  const handleToggleItem = (category: Category, id: number) => {
    setSelectedButtons((prevSelected) => {
      const selectedItems = prevSelected[category] ?? [];
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
      bedrooms: [0],
      bathrooms: [0],
      lobbies: [0],
      price: [0],
      area: [1],
    });
  };

  if (isLoading) return <FilterSkeleton />;

  return (
    <div
      ref={filterRef}
      className={clsx(
        "w-full rounded-lg bg-premium-background py-4 shadow-md transition-all duration-300 ease-in-out sm:w-72 md:w-80 dark:bg-premium-backgroundDark",
        isFixed && "sticky top-32 z-10 lg:top-20"
      )}
    >
      <div className="mt-1 space-y-6">
        <div className="flex items-center justify-between rounded-md pl-2 pr-6">
          <button
            onClick={resetFilters}
            className="transform px-4 py-1 text-lg font-medium text-premium-textPrimary transition-transform duration-200 hover:scale-110 hover:font-semibold dark:text-premium-textPrimary"
          >
            Borrar filtros
          </button>
          <div
            className="flex cursor-pointer items-center text-premium-textPrimary dark:text-premium-textPrimary"
            onClick={() => setFilterOpen(false)}
          >
            <X className="transform transition-transform duration-200 hover:scale-125" />
          </div>
        </div>

        <hr className="border-premium-borderColor dark:border-premium-borderColorHover" />

        <div className="space-y-4 overflow-x-hidden px-3 py-1 sm:max-h-[65vh] sm:overflow-y-auto">
          {/* Main filters */}
          {[
            {
              label: "Ciudades",
              icon: <Building2 />,
              items: metadata.cities,
              category: "cities" as Category,
            },
            {
              label: "Tipos de Inmueble",
              icon: <Building />,
              items: metadata.propertyTypes,
              category: "propertyTypes" as Category,
            },
            {
              label: "Tipos de Vivienda",
              icon: <House />,
              items: metadata.housingTypes,
              category: "housingTypes" as Category,
            },
            {
              label: "Áreas Comunes",
              icon: <Warehouse />,
              items: metadata.commonAreas,
              category: "commonAreas" as Category,
            },
            {
              label: "Servicios Cercanos",
              icon: <ConciergeBell />,
              items: metadata.nearbyServices,
              category: "nearbyServices" as Category,
            },
            {
              label: "Membresía",
              icon: <Crown />,
              items: metadata.memberships,
              category: "memberships" as Category,
            },
          ].map(({ label, icon, items, category }) => (
            <FilterOption
              key={category}
              label={label}
              icon={icon}
              items={items}
              selectedItems={getSelectedItems(category)}
              onToggleItem={(id) => handleToggleItem(category, id)}
              isOpen={isOpen[category]}
              onToggleOpen={() => toggleOpen(category)}
            />
          ))}

          {/* Filters with sliders */}
          {[
            ...(isProperty
              ? [
                  {
                    label: "Precio",
                    icon: <DollarSign />,
                    value: getSelectedValue("price"),
                    min: priceRange.min || 0,
                    max: priceRange.max || 0,
                    step: 100000,
                    category: "price" as Category,
                    prefixText: "Desde",
                    suffixText: "COP",
                  },
                ]
              : []),
            {
              label: "Área",
              icon: <Ruler />,
              value: getSelectedValue("area"),
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
                category={category}
                prefixText={prefixText}
                suffixText={suffixText}
              />
            )
          )}

          {/* Filters with counters */}
          {[
            {
              label: "Nº de habitaciones",
              icon: <Bed />,
              category: "bedrooms" as "bedrooms" | "bathrooms" | "lobbies",
            },
            {
              label: "Nº de baños",
              icon: <Toilet />,
              category: "bathrooms" as "bedrooms" | "bathrooms" | "lobbies",
            },
            {
              label: "Nº de salas de estar",
              icon: <Sofa />,
              category: "lobbies" as "bedrooms" | "bathrooms" | "lobbies",
            },
          ].map(({ label, icon, category }) => (
            <FilterNumericCounter
              key={category}
              label={label}
              icon={icon}
              isOpen={isOpen[category]}
              setIsOpen={() => toggleOpen(category)}
              value={getSelectedValue(category)}
              increment={() => changeCount(category, true)}
              decrement={() => changeCount(category, false)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
