"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectView } from "@/lib/definitios";

export function useGetBasicProjects() {
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setErrorProjects(null);

    try {
      const response = await fetch("/api/projects/basic");

      if (!response.ok) {
        throw new Error(
          `Error fetching basic projects: ${response.statusText}`
        );
      }

      const data = await response.json();

      setProjects(data.projects || []);
      setTotalEntries(data.totalEntries || 0);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        setErrorProjects(error.message || "Error desconocido");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    totalEntries,
    isLoading,
    errorProjects,
  };
}
