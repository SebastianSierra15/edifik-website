"use client";

import { useEffect, useState } from "react";
import type { ProjectView } from "@/src/interfaces";
import { ProjectHomeService } from "@/src/services/projects";

interface UseHomeProjectsOptions {
  initialProjects?: ProjectView[] | null;
}

export function useHomeProjects(
  numberProjects: number,
  isProperty: boolean,
  options?: UseHomeProjectsOptions
) {
  const hasInitialProjects = Array.isArray(options?.initialProjects);
  const [projects, setProjects] = useState<ProjectView[]>(
    options?.initialProjects ?? []
  );
  const [isLoading, setIsLoading] = useState<boolean>(!hasInitialProjects);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasInitialProjects) return;
    let isMounted = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { projects } = await ProjectHomeService.getHomeProjects({
          numberProjects,
          isProperty,
        });

        if (!isMounted) return;
        setProjects(projects ?? []);
      } catch (err: unknown) {
        if (!isMounted) return;
        setError(
          err instanceof Error ? err.message : "Error al cargar proyectos"
        );
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void run();
    return () => {
      isMounted = false;
    };
  }, [numberProjects, isProperty, hasInitialProjects]);

  return { projects, isLoading, error };
}
