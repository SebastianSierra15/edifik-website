import { useState } from "react";

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  address: { [key: string]: string };
}

export function useAddressSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddress = async (query: string) => {
    if (!query) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${query}`
      );
      if (!response.ok) {
        throw new Error("Error en la búsqueda de dirección");
      }
      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchAddress };
}
