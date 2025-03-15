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
      const startFetch = performance.now(); // Inicia medición del tiempo de fetch

      const response = await fetch("/api/projects/metadata/image-types", {
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
