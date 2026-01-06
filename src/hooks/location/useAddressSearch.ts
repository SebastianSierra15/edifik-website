"use client";

import { useCallback, useState } from "react";

export interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export function useAddressSearch() {
  const [results, setResults] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddress = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`,
        {
          headers: {
            "Accept-Language": "es",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al buscar direcciones");
      }

      const data: AddressSuggestion[] = await response.json();
      setResults(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "No se pudo buscar la dirección"
      );
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    isLoading,
    error,
    searchAddress,
    clearResults,
  };
}
