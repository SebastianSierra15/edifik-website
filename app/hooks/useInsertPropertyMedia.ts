import { useState } from "react";

type MediaType = {
  id: number;
  category: "imageType" | "commonArea";
};

export function useInsertPropertyMedia() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const insertPropertyMedia = async (
    propertyId: number,
    urlsMatrix: string[][],
    typesArray: MediaType[]
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/properties/metadata/property-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          urlsMatrix,
          typesArray,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al insertar el media.");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { insertPropertyMedia, loading, error, success };
}
