import { useEffect, useState } from "react";
import { ImageType } from "@/lib/definitios";

export default function useImageTypes() {
  const [imagesTypes, setImagesTypes] = useState<ImageType[]>([]);
  const [loadingImages, setLoadingImages] = useState<boolean>(true);
  const [errorImages, setErrorImages] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/properties/metadata/image-types");
        if (!response.ok) throw new Error("Error al obtener los datos");

        const data: ImageType[] = await response.json();
        setImagesTypes(data);
      } catch (err: any) {
        setErrorImages(err.message || "Error desconocido");
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImages();
  }, []);

  return { imagesTypes, loadingImages, errorImages };
}
