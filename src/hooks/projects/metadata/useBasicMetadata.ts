"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectsBasicMetadata } from "@/src/interfaces";
import {
  fetchBasicMetadata,
  getCachedBasicMetadata,
} from "./metadataCache";

export function useBasicMetadata() {
  const [metadata, setMetadata] = useState<ProjectsBasicMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState<boolean>(true);
  const [errorMetadata, setErrorMetadata] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const cached = getCachedBasicMetadata();

    if (cached) {
      setMetadata(cached);
      setLoadingMetadata(false);
      return () => {
        isMounted = false;
      };
    }

    setLoadingMetadata(true);
    setErrorMetadata(null);

    fetchBasicMetadata()
      .then((data) => {
        if (!isMounted) return;
        setMetadata(data);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setErrorMetadata(
          err instanceof Error ? err.message : "Error desconocido"
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingMetadata(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    metadata: useMemo(() => metadata, [metadata]),
    loadingMetadata,
    errorMetadata,
  };
}
