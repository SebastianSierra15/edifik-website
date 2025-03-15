import { useEffect, useState, useCallback, useMemo } from "react";
import { City, Departament } from "@/lib/definitios";

interface LocationsData {
  departaments: Departament[];
  cities: City[];
}

export default function useLocations() {
  const [locations, setLocations] = useState<LocationsData | null>(null);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [errorLocations, setErrorLocations] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoadingLocations(true);
      const startFetch = performance.now(); // Inicia medición del tiempo de fetch

      const response = await fetch("/api/projects/metadata/cities", { signal });

      const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
      const serverTiming = response.headers.get("Server-Timing");

      console.log(
        `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
      );
      console.log("⏳ Server Timing Metrics:", serverTiming);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: LocationsData = await response.json();
      setLocations(data);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setErrorLocations(err.message || "Error desconocido");
      }
    } finally {
      setLoadingLocations(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const memoizedLocations = useMemo(() => locations, [locations]);

  return { locations: memoizedLocations, loadingLocations, errorLocations };
}
