"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProjectsMetadata } from "@/src/interfaces";
import { ProjectMetadataService } from "@/src/services";

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

  const fetchMetadata = useCallback(async () => {
    if (metadata.cities.length > 0) return;

    setIsLoadingMetadata(true);
    setError(null);

    try {
      const data = await ProjectMetadataService.getAll();
      setMetadata(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoadingMetadata(false);
    }
  }, [metadata.cities.length]);

  useEffect(() => {
    void fetchMetadata();
  }, [fetchMetadata]);

  const memoizedMetadata = useMemo(() => metadata, [metadata]);

  return { metadata: memoizedMetadata, isLoadingMetadata, error };
}
