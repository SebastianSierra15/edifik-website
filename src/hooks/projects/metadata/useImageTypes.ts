"use client";

import { useEffect, useMemo, useState } from "react";
import type { ImageType } from "@/src/interfaces";
import { fetchImageTypes, getCachedImageTypes } from "./metadataCache";

export function useImageTypes() {
  const [imagesTypes, setImagesTypes] = useState<ImageType[]>([]);
  const [loadingImages, setLoadingImages] = useState<boolean>(true);
  const [errorImages, setErrorImages] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const cached = getCachedImageTypes();

    if (cached) {
      setImagesTypes(cached);
      setLoadingImages(false);
      return () => {
        isMounted = false;
      };
    }

    setLoadingImages(true);
    setErrorImages(null);

    fetchImageTypes()
      .then((data) => {
        if (!isMounted) return;
        setImagesTypes(data ?? []);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setErrorImages(err instanceof Error ? err.message : "Error desconocido");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingImages(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    imagesTypes: useMemo(() => imagesTypes, [imagesTypes]),
    loadingImages,
    errorImages,
  };
}
