"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProjectsCitiesMetadata } from "@/src/interfaces";
import { ProjectMetadataService } from "@/src/services/projects";

export function useLocations() {
  const [locations, setLocations] = useState<ProjectsCitiesMetadata | null>(
    null
  );
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [errorLocations, setErrorLocations] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    setLoadingLocations(true);
    setErrorLocations(null);

    try {
      const data = await ProjectMetadataService.getCities();
      setLocations(data);
    } catch (err: unknown) {
      setErrorLocations(
        err instanceof Error ? err.message : "Error desconocido"
      );
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  useEffect(() => {
    void fetchLocations();
  }, [fetchLocations]);

  return {
    locations: useMemo(() => locations, [locations]),
    loadingLocations,
    errorLocations,
  };
}
