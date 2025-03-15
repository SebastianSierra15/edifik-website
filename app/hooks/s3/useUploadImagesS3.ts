import { useState, useCallback } from "react";
import { Media, ProjectMedia } from "@/lib/definitios";

export function useUploadImagesS3() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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
        setUploadStatus("Procesando y cargando imágenes...");
        setUploadProgress(0);

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

            const startFetch = performance.now(); // Inicia medición del tiempo de fetch

            const response = await fetch("/api/s3/projects/images/upload", {
              method: "POST",
              body: formData,
              signal,
            });

            const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
            const serverTiming = response.headers.get("Server-Timing");

            console.log(
              `⏱️ Tiempo total de fetch para subir imagen: ${(endFetch - startFetch).toFixed(2)}ms`
            );
            console.log("⏳ Server Timing Metrics:", serverTiming);

            if (!response.ok) {
              throw new Error(
                `Error al cargar la imagen: ${
                  typeof item.file === "string"
                    ? "URL existente"
                    : item.file.name
                }`
              );
            }

            const { url } = await response.json();

            setUploadProgress(Math.round(((index + 1) / media.length) * 100));

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
          console.warn("Algunas imágenes no se pudieron subir:", failedUploads);
          setUploadStatus("Algunas imágenes no se pudieron subir.");
        } else {
          setUploadStatus("Imágenes subidas satisfactoriamente.");
        }

        return successfulUploads;
      } catch (error) {
        console.error("Error al subir imágenes:", error);
        setUploadStatus("Error al subir imágenes.");
        throw error;
      } finally {
        setUploadProgress(100);
      }
    },
    []
  );

  return { uploadImages, uploadStatus, uploadProgress };
}
