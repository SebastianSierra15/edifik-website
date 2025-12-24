"use client";

import { useCallback, useState } from "react";
import {
  ProjectMediaService,
  CreateProjectMediaInput,
  UpdateProjectMediaInput,
} from "@/src/services/projects";
import type { ProjectMedia } from "@/src/interfaces";

export function useProjectMediaApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const insertProjectMedia = useCallback(
    async (projectMedia: ProjectMedia[]) => {
      if (!projectMedia?.length) return;

      const formattedProjectMedia: CreateProjectMediaInput[] = projectMedia.map(
        (media) => ({
          url: media.url,
          tag: media.tag,
          description: media.description ?? null,
          projectId: media.projectId,
          commonAreaId: media.commonArea ?? null,
          imageTypeId: media.imageType ?? null,
        })
      );

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        await ProjectMediaService.create(formattedProjectMedia);
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
