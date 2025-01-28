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

        const response = await fetch("/api/projects/metadata/project-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectMedia: formattedProjectMedia }),
        });

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
        const response = await fetch("/api/projects/metadata/project-media", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectMedia }),
        });

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
      const response = await fetch("/api/projects/metadata/project-media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaIds: mediaIds }),
      });

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
