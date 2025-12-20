"use client";

import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { MapPin } from "lucide-react";
import { TooltipIcon } from "./TooltipIcon";
import FormErrorMessage from "../../../../app/ui/modals/formErrorMessage";

interface FormSearchAddressProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (placeId: string, description: string) => void;
  error?: string;
  flag?: boolean;
  isLoaded: boolean;
  tooltipText?: string;
}

export function FormSearchAddress({
  label,
  value,
  onChange,
  onSelect,
  error,
  isLoaded,
  tooltipText,
}: FormSearchAddressProps) {
  const [suggestions, setSuggestions] = useState<
    { place_id: string; description: string }[]
  >([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
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
    if (
      isLoaded &&
      typeof window !== "undefined" &&
      typeof window.google !== "undefined" &&
      window.google.maps?.places &&
      !autocompleteServiceRef.current
    ) {
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (newValue.trim() && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: newValue,
          componentRestrictions: { country: "CO" },
        },
        (predictions) => {
          if (predictions) {
            setSuggestions(
              predictions.map((prediction) => ({
                place_id: prediction.place_id,
                description: prediction.description,
              }))
            );
            setIsListVisible(true);
          } else {
            console.warn("[Predictions] No predictions found");
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (placeId: string, description: string) => {
    onSelect(placeId, description);
    setIsListVisible(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <label
        htmlFor="searchAddress"
        className="mb-2 flex items-center gap-2 text-premium-textPrimary dark:text-premium-textPrimary"
      >
        {label}
        {error !== undefined && " *"}
        {tooltipText && <TooltipIcon tooltipText={tooltipText} />}
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
        placeholder="Ingrese la dirección"
        autoComplete="street-address"
        className={clsx(
          "w-full rounded-md border bg-premium-background px-3 py-2 text-premium-textPrimary dark:bg-premium-backgroundLight dark:text-premium-textPrimary focus:outline-none focus:ring-2 focus:ring-premium-primary",
          error
            ? "border-red-500 bg-red-50"
            : "border-premium-borderColor dark:border-premium-borderColorHover"
        )}
      />

      {isListVisible && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full border border-premium-borderColor dark:border-premium-borderColorHover 
          bg-premium-background dark:bg-premium-backgroundLight rounded-md shadow-lg"
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() =>
                handleSelect(suggestion.place_id, suggestion.description)
              }
              className="cursor-pointer flex items-center gap-2 p-2 text-premium-textPrimary dark:text-premium-textPrimary hover:bg-premium-secondaryLight dark:hover:bg-premium-secondaryDark 
              transition-colors rounded-md"
            >
              <MapPin className="h-4 w-4 text-premium-primary" />
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
      {error && <FormErrorMessage error={error} />}
    </div>
  );
}
