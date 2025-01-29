import { useState, useCallback } from "react";
import { extractS3KeyFromUrl } from "@/utils/extractS3KeyFromUrl";

export function useDeleteImagesS3() {
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);
  const [deleteProgress, setDeleteProgress] = useState<number>(0);

  const deleteImages = useCallback(async (imageUrls: string[]) => {
    if (imageUrls.length === 0) {
      console.warn("⚠️ No se proporcionaron imágenes para eliminar.");
      return;
    }

    try {
      setDeleteStatus("Eliminando imágenes...");
      setDeleteProgress(0);

      const deleteResults = await Promise.allSettled(
        imageUrls.map(async (url, index) => {
          const s3Key = extractS3KeyFromUrl(url);
          if (!s3Key) {
            console.warn(
              `❌ No se pudo extraer la clave de S3 de la URL: ${url}`
            );
            return null;
          }

          const response = await fetch("/api/s3/projects/images/delete", {
            method: "POST",
            body: JSON.stringify({ key: s3Key }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`❌ Error al eliminar la imagen: ${s3Key}`);
          }

          setDeleteProgress(Math.round(((index + 1) / imageUrls.length) * 100));

          return s3Key;
        })
      );

      const successfulDeletes = deleteResults
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as PromiseFulfilledResult<string>).value);

      const failedDeletes = deleteResults.filter(
        (result) => result.status === "rejected"
      );

      if (failedDeletes.length > 0) {
        console.warn(
          "❌ Algunas imágenes no se pudieron eliminar:",
          failedDeletes
        );
        setDeleteStatus("Algunas imágenes no se pudieron eliminar.");
      } else {
        setDeleteStatus("Imágenes eliminadas satisfactoriamente.");
      }

      return successfulDeletes;
    } catch (error) {
      console.error("❌ Error al eliminar imágenes:", error);
      setDeleteStatus("Error al eliminar imágenes.");
      throw error;
    } finally {
      setDeleteProgress(100);
    }
  }, []);

  return { deleteImages, deleteStatus, deleteProgress };
}
