"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectsCitiesMetadata } from "@/src/interfaces";
import {
  fetchLocationsMetadata,
  getCachedLocationsMetadata,
} from "./metadataCache";

export function useLocations() {
  const [locations, setLocations] = useState<ProjectsCitiesMetadata | null>(
    null
  );
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [errorLocations, setErrorLocations] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const cached = getCachedLocationsMetadata();

    if (cached) {
      setLocations(cached);
      setLoadingLocations(false);
      return () => {
        isMounted = false;
      };
    }

    setLoadingLocations(true);
    setErrorLocations(null);

    fetchLocationsMetadata()
      .then((data) => {
        if (!isMounted) return;
        setLocations(data);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setErrorLocations(
          err instanceof Error ? err.message : "Error desconocido"
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingLocations(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    locations: useMemo(() => locations, [locations]),
    loadingLocations,
    errorLocations,
  };
}
