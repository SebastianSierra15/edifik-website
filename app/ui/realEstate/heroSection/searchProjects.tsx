"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface SearchProjectsProps {
  onSelectLocation: (coords: { latitude: number; longitude: number }) => void;
}

export default function SearchProjects({
  onSelectLocation,
}: SearchProjectsProps) {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<
    { place_id: string; description: string }[]
  >([]);
  const [isListVisible, setIsListVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);

  const isMapsReady = typeof window !== "undefined" && !!window.google?.maps;

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
    if (
      isMapsReady &&
      typeof window !== "undefined" &&
      typeof window.google !== "undefined" &&
      window.google.maps?.places &&
      !autocompleteServiceRef.current
    ) {
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
    }
  }, [isMapsReady]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchInput(newValue);

    if (newValue.trim() && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: newValue,
          componentRestrictions: { country: "CO" },
        },
        (predictions) => {
          if (predictions) {
            setSuggestions(
              predictions.map((p) => ({
                place_id: p.place_id,
                description: p.description,
              }))
            );
            setIsListVisible(true);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectPlace = (placeId: string, description: string) => {
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails({ placeId }, (place, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        place?.geometry?.location
      ) {
        const location = place.geometry.location;

        onSelectLocation({
          latitude: location.lat(),
          longitude: location.lng(),
        });

        setSearchInput(description);
        setIsListVisible(false);
      }
    });
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

      {isListVisible && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-1 w-full bg-white border border-client-accent rounded-md shadow-lg max-h-64 overflow-y-auto"
        >
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              onClick={() => {
                handleSelectPlace(s.place_id, s.description);
              }}
              className="cursor-pointer flex items-center gap-2 p-2 hover:bg-client-secondary transition-colors"
            >
              <MapPin size={16} className="text-client-accent" />
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
