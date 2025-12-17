"use client";

import { useCallback, useState } from "react";
import {
  ProjectMediaService,
  CreateProjectMediaInput,
  UpdateProjectMediaInput,
} from "@/src/services/projects";

export function useProjectMediaApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const insertProjectMedia = useCallback(
    async (projectMedia: CreateProjectMediaInput[]) => {
      if (!projectMedia?.length) return;

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        await ProjectMediaService.create(projectMedia);
        setSuccess(true);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Error al insertar media"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateProjectMedia = useCallback(
    async (projectMedia: UpdateProjectMediaInput[]) => {
      if (!projectMedia?.length) return;

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        await ProjectMediaService.update(projectMedia);
        setSuccess(true);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Error al actualizar media"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteProjectMedia = useCallback(async (mediaIds: number[]) => {
    if (!mediaIds?.length) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await ProjectMediaService.delete(mediaIds);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar media");
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
