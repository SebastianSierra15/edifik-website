"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProjectView } from "@/src/interfaces";
import { ProjectPublicService } from "@/src/services/projects";

export function useGetBasicProjects() {
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setErrorProjects(null);

    try {
      const data = await ProjectPublicService.getBasicProjects();
      setProjects(data.projects ?? []);
      setTotalEntries(data.totalEntries ?? 0);
    } catch (err: unknown) {
      setErrorProjects(
        err instanceof Error ? err.message : "Error desconocido"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  return { projects, totalEntries, isLoading, errorProjects };
}
