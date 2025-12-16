import { useState, useCallback } from "react";
import { extractS3KeyFromUrl } from "@/src/modules/shared";
import { Media, ProjectMedia } from "@/lib/definitios";

export function useS3ImagesApi() {
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const processImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 1200;
          const maxHeight = 700;

          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              width = maxWidth;
              height = Math.round((maxWidth * img.height) / img.width);
            } else {
              height = maxHeight;
              width = Math.round((maxHeight * img.width) / img.height);
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const webpFile = new File([blob], file.name, {
                    type: "image/webp",
                  });
                  resolve(webpFile);
                } else {
                  reject(new Error("Error al procesar la imagen"));
                }
              },
              "image/webp",
              0.75
            );
          }
        };
        img.onerror = () => reject(new Error("Error cargando la imagen"));
        img.src = event.target?.result as string;
      };

      reader.onerror = () => reject(new Error("Error leyendo el archivo"));
      reader.readAsDataURL(file);
    });
  };

  const uploadImages = useCallback(
    async (
      projectId: number,
      media: Media[],
      propertyTypeName: string
    ): Promise<ProjectMedia[]> => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        setStatus("Procesando y subiendo imágenes...");
        setProgress(0);

        const processedMedia = await Promise.allSettled(
          media.map(async (item, index) => {
            const processedFile =
              typeof item.file === "string"
                ? null
                : await processImage(item.file);

            if (!processedFile) {
              console.warn(
                `🔹 Se omitió la subida de ${item.file} porque es una URL existente.`
              );
              return null;
            }

            const formData = new FormData();
            formData.append("file", processedFile);
            formData.append(
              "path",
              `projects/images/${propertyTypeName}/${projectId}/${item.type}/`
            );

            const response = await fetch("/api/s3", {
              method: "POST",
              body: formData,
              signal,
            });

            if (!response.ok) {
              throw new Error(
                `Error al cargar la imagen: ${processedFile.name}`
              );
            }

            const { url } = await response.json();

            setProgress(Math.round(((index + 1) / media.length) * 100));

            return {
              url,
              tag: item.tag,
              description: item.description,
              projectId,
              commonArea:
                item.category === "commonArea" ? item.idType : undefined,
              imageType:
                item.category === "imageType" ? item.idType : undefined,
            } as ProjectMedia;
          })
        );

        const successfulUploads = processedMedia
          .filter((result) => result.status === "fulfilled")
          .map(
            (result) => (result as PromiseFulfilledResult<ProjectMedia>).value
          );

        const failedUploads = processedMedia.filter(
          (result) => result.status === "rejected"
        );

        if (failedUploads.length > 0) {
          console.warn(
            "⚠️ Algunas imágenes no se pudieron subir:",
            failedUploads
          );
          setStatus("Algunas imágenes no se pudieron subir.");
        } else {
          setStatus("Imágenes subidas satisfactoriamente.");
        }

        return successfulUploads;
      } catch (error) {
        console.error("🚨 Error al subir imágenes:", error);
        setStatus("Error al subir imágenes.");
        throw error;
      } finally {
        setProgress(100);
      }
    },
    []
  );

  const deleteImages = useCallback(async (imageUrls: string[]) => {
    if (imageUrls.length === 0) {
      console.warn("⚠️ No se proporcionaron imágenes para eliminar.");
      return;
    }

    try {
      setStatus("Eliminando imágenes...");
      setProgress(0);

      const deleteResults = await Promise.allSettled(
        imageUrls.map(async (url, index) => {
          const s3Key = extractS3KeyFromUrl(url);
          if (!s3Key) {
            console.warn(
              `❌ No se pudo extraer la clave de S3 de la URL: ${url}`
            );
            return null;
          }

          const response = await fetch("/api/s3", {
            method: "DELETE",
            body: JSON.stringify({ key: s3Key }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`❌ Error al eliminar la imagen: ${s3Key}`);
          }

          setProgress(Math.round(((index + 1) / imageUrls.length) * 100));

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
        setStatus("Algunas imágenes no se pudieron eliminar.");
      } else {
        setStatus("Imágenes eliminadas satisfactoriamente.");
      }

      return successfulDeletes;
    } catch (error) {
      console.error("❌ Error al eliminar imágenes:", error);
      setStatus("Error al eliminar imágenes.");
      throw error;
    } finally {
      setProgress(100);
    }
  }, []);

  return { uploadImages, deleteImages, status, progress };
}
