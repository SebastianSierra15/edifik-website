"use client";

import { useEffect, useState } from "react";
import { ProjectDetails } from "@/src/interfaces";
import { ProjectService } from "@/src/services/projects";

export function useProjectById(
  id?: number,
  isProject?: boolean,
  isAdmin?: boolean,
  initialProject?: ProjectDetails
) {
  const [project, setProject] = useState<ProjectDetails | null>(
    initialProject ?? null
  );
  const [loading, setLoading] = useState(!initialProject);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    if (initialProject?.id === id) {
      setProject(initialProject);
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        setLoading(true);
        const { project } = await ProjectService.getById(
          id,
          isProject,
          isAdmin
        );
        setProject(project);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : null;
        setError(message || "No se pudo cargar el proyecto");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, isProject, isAdmin, initialProject]);

  return { project, loading, error };
}
