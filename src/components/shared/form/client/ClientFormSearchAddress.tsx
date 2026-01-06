"use client";

import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { MapPin } from "lucide-react";
import { ClientTooltipIcon } from "./ClientTooltipIcon";
import { ClientFormErrorMessage } from "./ClientFormErrorMessage";

interface AddressSuggestion {
  placeId: string;
  description: string;
  lat: number;
  lng: number;
}

interface ClientFormSearchAddressProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
  error?: string;
  flag?: boolean;
  isLoaded: boolean;
  tooltipText?: string;
}

export function ClientFormSearchAddress({
  label,
  value,
  onChange,
  onSelect,
  error,
  isLoaded,
  tooltipText,
}: ClientFormSearchAddressProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (!isLoaded || !newValue.trim()) {
      setSuggestions([]);
      setIsListVisible(false);
      return;
    }

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          format: "json",
          q: newValue,
          addressdetails: "1",
          limit: "5",
          countrycodes: "co",
        });
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params.toString()}`
        );
        if (!response.ok) {
          setSuggestions([]);
          setIsListVisible(false);
          return;
        }
        const data: Array<{
          place_id: number;
          display_name: string;
          lat: string;
          lon: string;
        }> = await response.json();

        const nextSuggestions = data.map((item) => ({
          placeId: String(item.place_id),
          description: item.display_name,
          lat: Number(item.lat),
          lng: Number(item.lon),
        }));

        setSuggestions(nextSuggestions);
        setIsListVisible(nextSuggestions.length > 0);
      } catch (error) {
        console.warn("[Nominatim] Error fetching suggestions", error);
        setSuggestions([]);
        setIsListVisible(false);
      }
    }, 250);
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    onSelect(suggestion);
    setIsListVisible(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <label
        htmlFor="searchAddress"
        className="mb-2 flex items-center gap-2 text-client-text"
      >
        {label}
        {error !== undefined && " *"}
        {tooltipText && <ClientTooltipIcon tooltipText={tooltipText} />}
      </label>

      <input
        ref={inputRef}
        id="searchAddress"
        type="text"
        name="address"
        defaultValue={value}
        onChange={(e) => {
          handleInputChange(e);
        }}
        placeholder="Ingrese la direcciИn"
        autoComplete="street-address"
        className={clsx(
          "w-full rounded-md border bg-client-backgroundLight px-3 py-2 focus:outline-none focus:ring-2 focus:ring-client-primary text-client-text",
          error ? "border-red-500" : "border-client-accent"
        )}
      />

      {isListVisible && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full border border-client-accent bg-client-backgroundLight rounded-md shadow-lg"
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.placeId}
              onClick={() => handleSelect(suggestion)}
              className="cursor-pointer flex items-center gap-2 p-2 text-client-text hover:bg-client-backgroundAlt transition-colors rounded-md"
            >
              <MapPin className="h-4 w-4 text-client-accent" />
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
      {error && <ClientFormErrorMessage error={error} />}
    </div>
  );
}
