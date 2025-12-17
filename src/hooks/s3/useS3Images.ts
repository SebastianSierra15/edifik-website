import { useState, useCallback } from "react";
import { Media, ProjectMedia } from "@/src/interfaces";
import { S3Service } from "@/src/services/s3";

export function useS3Images() {
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const uploadImages = useCallback(
    async (
      projectId: number,
      propertyTypeName: string,
      media: Media[]
    ): Promise<ProjectMedia[]> => {
      setLoading(true);
      setStatus("Procesando y subiendo imágenes...");
      setProgress(0);

      try {
        return await S3Service.uploadImages(
          projectId,
          propertyTypeName,
          media,
          setProgress
        );
      } finally {
        setLoading(false);
        setProgress(100);
      }
    },
    []
  );

  const deleteImages = useCallback(async (urls: string[]) => {
    setLoading(true);
    setStatus("Eliminando imágenes...");
    setProgress(0);

    try {
      return await S3Service.deleteImages(urls, setProgress);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  }, []);

  return {
    uploadImages,
    deleteImages,
    loading,
    progress,
    status,
  };
}
