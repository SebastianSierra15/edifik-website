"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";
import { useAddressAutocomplete } from "@/src/hooks/realEstate";

interface SearchProjectsProps {
  onSelectLocation: (
    coords: { latitude: number; longitude: number } | null
  ) => void;
  clearInput?: boolean;
}

export function SearchProjects({
  onSelectLocation,
  clearInput = false,
}: SearchProjectsProps) {
  const [searchInput, setSearchInput] = useState("");
  const [isListVisible, setIsListVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { results, searchAddress, clearResults } = useAddressAutocomplete();

  useEffect(() => {
    if (clearInput) {
      setSearchInput("");
      clearResults();
      setIsListVisible(false);
    }
  }, [clearInput, clearResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsListVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchInput(newValue);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!newValue.trim()) {
      clearResults();
      setIsListVisible(false);
      return;
    }

    clearResults();
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(newValue);
      setIsListVisible(true);
    }, 300);
  };

  const handleSelectPlace = (place: {
    display_name: string;
    lat: string;
    lon: string;
  }) => {
    const latitude = Number.parseFloat(place.lat);
    const longitude = Number.parseFloat(place.lon);

    if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
      onSelectLocation({
        latitude,
        longitude,
      });
    }

    setSearchInput(place.display_name);
    setIsListVisible(false);
    clearResults();
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder="Dirección…"
        onChange={handleInputChange}
        value={searchInput}
        className="flex-1 px-4 py-2 text-sm text-client-primary placeholder:text-client-text-placeholder outline-none w-full rounded-md"
      />

      {searchInput && (
        <button
          type="button"
          onClick={() => {
            setSearchInput("");
            setIsListVisible(false);
            clearResults();
            onSelectLocation(null);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-client-text-placeholder hover:text-black"
          aria-label="Limpiar búsqueda"
        >
          <X size={18} />
        </button>
      )}

      {isListVisible && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-1 w-full bg-white border border-client-accent rounded-md shadow-lg max-h-64 overflow-y-auto"
        >
          {results.map((s) => (
            <li
              key={String(s.place_id)}
              onClick={() => {
                handleSelectPlace(s);
              }}
              className="cursor-pointer flex items-center gap-2 p-2 hover:bg-client-secondary transition-colors"
            >
              <MapPin size={16} className="text-client-accent" />
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
