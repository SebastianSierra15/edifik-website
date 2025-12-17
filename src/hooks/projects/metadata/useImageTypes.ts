"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ImageType } from "@/src/interfaces";
import { ProjectMetadataService } from "@/src/services/projects";

export function useImageTypes() {
  const [imagesTypes, setImagesTypes] = useState<ImageType[]>([]);
  const [loadingImages, setLoadingImages] = useState<boolean>(true);
  const [errorImages, setErrorImages] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setLoadingImages(true);
    setErrorImages(null);

    try {
      const data = await ProjectMetadataService.getImageTypes();
      setImagesTypes(data ?? []);
    } catch (err: unknown) {
      setErrorImages(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoadingImages(false);
    }
  }, []);

  useEffect(() => {
    void fetchImages();
  }, [fetchImages]);

  return {
    imagesTypes: useMemo(() => imagesTypes, [imagesTypes]),
    loadingImages,
    errorImages,
  };
}
