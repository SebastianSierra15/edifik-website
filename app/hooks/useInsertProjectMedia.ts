import { useState } from "react";
import { ProjectMedia } from "@/lib/definitios";

export function useInsertProjectMedia() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const insertProjectMedia = async (projectMedia: ProjectMedia[]) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/projects/metadata/project-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectMedia,
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

  return { insertProjectMedia, loading, error, success };
}
