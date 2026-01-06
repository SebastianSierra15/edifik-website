"use client";

import { useCallback, useState } from "react";
import { NominatimService, NominatimSearchResult } from "@/src/services/realEstate";

export function useAddressAutocomplete() {
  const [results, setResults] = useState<NominatimSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddress = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 3) {
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await NominatimService.search({
        query: trimmedQuery,
        limit: 5,
        countryCodes: "co",
        language: "es-CO",
      });
      setResults(data);
    } catch (err: unknown) {
      setResults([]);
      setError(
        err instanceof Error ? err.message : "No se pudo buscar la direccion"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    searchAddress,
    clearResults,
  };
}
