import { useState } from "react";

export function useUploadImages() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const uploadImages = async (
    propertyId: number,
    images: File[][],
    imageTypes: {
      type: string;
      id: number;
      category: "imageType" | "commonArea";
    }[]
  ): Promise<{
    urlsMatrix: string[][];
    typesArray: { id: number; category: "imageType" | "commonArea" }[];
  } | void> => {
    try {
      setUploadStatus("Uploading images...");

      const uploadPromises = images.map((imageArray, index) =>
        imageArray.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "path",
            `properties/images/${propertyId}/${imageTypes[index].type}/`
          );

          const response = await fetch("/api/s3/properties/images/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Error uploading the image: ${file.name}`);
          }

          const { url } = await response.json();
          return url;
        })
      );

      const urlsMatrix = await Promise.all(
        uploadPromises.map((promise) => Promise.all(promise))
      );

      const typesArray = imageTypes.map(({ id, category }) => ({
        id,
        category,
      }));

      setUploadStatus("Images uploaded successfully");

      return { urlsMatrix, typesArray };
    } catch (error) {
      console.error("Error uploading images:", error);
      setUploadStatus("Error uploading images");
    }
  };

  return { uploadImages, uploadStatus };
}
