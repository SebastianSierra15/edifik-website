"use client";

import { useEffect, useState } from "react";
import type { ProjectView } from "@/src/interfaces";
import { ProjectHomeService } from "@/src/services";

export function useHomeProjects(numberProjects: number, isProperty: boolean) {
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [numberProjects, isProperty]);

  return { projects, isLoading, error };
}
