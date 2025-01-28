import { useEffect, useState, useCallback, useMemo } from "react";
import { ImageType } from "@/lib/definitios";

export default function useImageTypes() {
  const [imagesTypes, setImagesTypes] = useState<ImageType[]>([]);
  const [loadingImages, setLoadingImages] = useState<boolean>(true);
  const [errorImages, setErrorImages] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoadingImages(true);
      const response = await fetch("/api/projects/metadata/image-types", {
        signal,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ImageType[] = await response.json();
      setImagesTypes(data);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setErrorImages(err.message || "Error desconocido");
      }
    } finally {
      setLoadingImages(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const memoizedImagesTypes = useMemo(() => imagesTypes, [imagesTypes]);

  return { imagesTypes: memoizedImagesTypes, loadingImages, errorImages };
}
