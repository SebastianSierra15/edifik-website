import { apiClient } from "@/src/lib";
import { extractS3KeyFromUrl } from "@/src/modules";
import { Media, ProjectMedia, S3UploadResult } from "@/src/interfaces";

export class S3Service {
  static async processImage(file: File): Promise<File> {
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
          if (!ctx) return reject("No canvas context");

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject("Blob error");

              resolve(
                new File([blob], file.name, {
                  type: "image/webp",
                })
              );
            },
            "image/webp",
            0.75
          );
        };

        img.onerror = () => reject("Image load error");
        img.src = event.target?.result as string;
      };

      reader.onerror = () => reject("File read error");
      reader.readAsDataURL(file);
    });
  }

  static async uploadImages(
    projectId: number,
    propertyTypeName: string,
    media: Media[],
    onProgress?: (percent: number) => void
  ): Promise<ProjectMedia[]> {
    const results: ProjectMedia[] = [];

    for (let i = 0; i < media.length; i++) {
      const item = media[i];

      if (typeof item.file === "string") continue;

      const processed = await this.processImage(item.file);

      const formData = new FormData();
      formData.append("file", processed);
      formData.append(
        "path",
        `projects/images/${propertyTypeName}/${projectId}/${item.tag}/`
      );

      const { url } = await apiClient.post<S3UploadResult, FormData>(
        "/api/s3",
        formData
      );

      results.push({
        url,
        tag: item.tag,
        description: item.description,
        projectId,
        commonArea: item.category === "commonArea" ? item.idType : undefined,
        imageType: item.category === "imageType" ? item.idType : undefined,
      });

      onProgress?.(Math.round(((i + 1) / media.length) * 100));
    }

    return results;
  }

  static async deleteImages(
    urls: string[],
    onProgress?: (percent: number) => void
  ): Promise<string[]> {
    const deleted: string[] = [];

    for (let i = 0; i < urls.length; i++) {
      const key = extractS3KeyFromUrl(urls[i]);
      if (!key) continue;

      await apiClient.delete<void>("/api/s3", { key });

      deleted.push(key);
      onProgress?.(Math.round(((i + 1) / urls.length) * 100));
    }

    return deleted;
  }
}
