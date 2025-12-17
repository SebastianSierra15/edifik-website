"use client";

import { useCallback, useState } from "react";
import { ProjectService } from "@/src/services/projects";

export function useDeleteProject() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const deleteProject = useCallback(async (projectId: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await ProjectService.deletePermanently(projectId);
      setSuccess(true);
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar el proyecto."
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteProject, loading, error, success };
}
