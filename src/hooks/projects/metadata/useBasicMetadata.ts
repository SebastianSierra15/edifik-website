"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProjectsBasicMetadata } from "@/src/interfaces";
import { ProjectMetadataService } from "@/src/services";

export function useBasicMetadata() {
  const [metadata, setMetadata] = useState<ProjectsBasicMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState<boolean>(true);
  const [errorMetadata, setErrorMetadata] = useState<string | null>(null);

  const fetchMetadata = useCallback(async () => {
    setLoadingMetadata(true);
    setErrorMetadata(null);

    try {
      const data = await ProjectMetadataService.getBasic();
      setMetadata(data);
    } catch (err: unknown) {
      setErrorMetadata(
        err instanceof Error ? err.message : "Error desconocido"
      );
    } finally {
      setLoadingMetadata(false);
    }
  }, []);

  useEffect(() => {
    void fetchMetadata();
  }, [fetchMetadata]);

  return {
    metadata: useMemo(() => metadata, [metadata]),
    loadingMetadata,
    errorMetadata,
  };
}
