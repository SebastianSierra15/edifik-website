import { useState } from "react";
import { Media, ProjectMedia } from "@/lib/definitios";

export function useUploadImages() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

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

  const uploadImages = async (
    projectId: number,
    media: Media[],
    propertyTypeName: string
  ): Promise<ProjectMedia[]> => {
    try {
      setUploadStatus("Processing and uploading images...");

      const processedMedia = await Promise.all(
        media.map(async (item) => {
          const processedFile = await processImage(item.file);

          const formData = new FormData();
          formData.append("file", processedFile);
          formData.append(
            "path",
            `projects/images/${propertyTypeName}/${projectId}/${item.type}/`
          );

          const response = await fetch("/api/s3/projects/images/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Error uploading the image: ${item.file.name}`);
          }

          const { url } = await response.json();

          return {
            url,
            tag: item.tag,
            description: item.description,
            projectId,
            commonArea:
              item.category === "commonArea" ? item.idType : undefined,
            imageType: item.category === "imageType" ? item.idType : undefined,
          } as ProjectMedia;
        })
      );

      setUploadStatus("Images uploaded successfully");
      return processedMedia;
    } catch (error) {
      console.error("Error uploading images:", error);
      setUploadStatus("Error uploading images");
      throw error;
    }
  };

  return { uploadImages, uploadStatus };
}
