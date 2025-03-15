import { useState, useCallback } from "react";
import { ProjectMedia } from "@/lib/definitios";

export function useProjectMediaApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const insertProjectMedia = useCallback(
    async (projectMedia: ProjectMedia[]) => {
      if (!projectMedia || projectMedia.length === 0) {
        console.warn("⚠️ No se proporcionaron datos para insertar.");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const formattedProjectMedia = projectMedia.map((media) => ({
          url: media.url,
          tag: media.tag,
          description: media.description ?? null,
          projectId: media.projectId,
          commonAreaId: media.commonArea ?? null,
          imageTypeId: media.imageType ?? null,
        }));

        const startFetch = performance.now(); // Inicia medición del tiempo de fetch

        const response = await fetch("/api/projects/metadata/project-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectMedia: formattedProjectMedia }),
        });

        const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
        const serverTiming = response.headers.get("Server-Timing");

        console.log(
          `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
        );
        console.log("⏳ Server Timing Metrics:", serverTiming);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Error desconocido al insertar media.");
        }

        setSuccess(true);
      } catch (err: any) {
        console.error("❌ Error al insertar projectMedia:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateProjectMedia = useCallback(
    async (
      projectMedia: { id: number; tag: string; description?: string }[]
    ) => {
      if (!projectMedia || projectMedia.length === 0) {
        console.warn("⚠️ No se proporcionaron datos para actualizar.");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const startFetch = performance.now(); // Inicia medición del tiempo de fetch

        const response = await fetch("/api/projects/metadata/project-media", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectMedia }),
        });

        const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
        const serverTiming = response.headers.get("Server-Timing");

        console.log(
          `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
        );
        console.log("⏳ Server Timing Metrics:", serverTiming);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            data.error || "Error desconocido al actualizar media."
          );
        }

        setSuccess(true);
      } catch (err: any) {
        console.error("❌ Error al actualizar projectMedia:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteProjectMedia = useCallback(async (mediaIds: number[]) => {
    if (!mediaIds || mediaIds.length === 0) {
      console.warn("⚠️ No se proporcionaron IDs para eliminar.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const startFetch = performance.now(); // Inicia medición del tiempo de fetch

      const response = await fetch("/api/projects/metadata/project-media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaIds: mediaIds }),
      });

      const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
      const serverTiming = response.headers.get("Server-Timing");

      console.log(
        `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
      );
      console.log("⏳ Server Timing Metrics:", serverTiming);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Error desconocido al eliminar projectMedia."
        );
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("❌ Error al eliminar projectMedia:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    insertProjectMedia,
    updateProjectMedia,
    deleteProjectMedia,
    loading,
    error,
    success,
  };
}
