"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectsMetadata } from "@/src/interfaces";
import {
  fetchProjectsMetadata,
  getCachedProjectsMetadata,
} from "./metadataCache";

export function useProjectsMetadata() {
  const [metadata, setMetadata] = useState<ProjectsMetadata>({
    cities: [],
    commonAreas: [],
    housingTypes: [],
    nearbyServices: [],
    propertyTypes: [],
    memberships: [],
  });

  const [isLoadingMetadata, setIsLoadingMetadata] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const cached = getCachedProjectsMetadata();

    if (cached) {
      setMetadata(cached);
      setIsLoadingMetadata(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoadingMetadata(true);
    setError(null);

    fetchProjectsMetadata()
      .then((data) => {
        if (!isMounted) return;
        setMetadata(data);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Error desconocido");
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoadingMetadata(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const memoizedMetadata = useMemo(() => metadata, [metadata]);

  return { metadata: memoizedMetadata, isLoadingMetadata, error };
}
