import { useEffect, useState, useCallback, useMemo } from "react";
import {
  CommonArea,
  HousingType,
  NearbyService,
  propertyType,
  Category,
} from "@/lib/definitios";

interface BasicMetadata {
  commonAreas: CommonArea[];
  housingTypes: HousingType[];
  nearbyServices: NearbyService[];
  propertyTypes: propertyType[];
  categories: Category[];
}

export default function useBasicMetadata() {
  const [metadata, setMetadata] = useState<BasicMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState<boolean>(true);
  const [errorMetadata, setErrorMetadata] = useState<string | null>(null);

  const fetchMetadata = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoadingMetadata(true);
      const startFetch = performance.now(); // Inicia medición del tiempo de fetch

      const response = await fetch("/api/projects/metadata/basic-metadata", {
        signal,
      });

      const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
      const serverTiming = response.headers.get("Server-Timing");

      console.log(
        `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
      );
      console.log("⏳ Server Timing Metrics:", serverTiming);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: BasicMetadata = await response.json();
      setMetadata(data);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setErrorMetadata(err.message || "Error desconocido");
      }
    } finally {
      setLoadingMetadata(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  const memoizedMetadata = useMemo(() => metadata, [metadata]);

  return { metadata: memoizedMetadata, loadingMetadata, errorMetadata };
}
