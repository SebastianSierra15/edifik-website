"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectSummary } from "@/lib/definitios";

interface UseMyProjectsOptions {
  entriesPerPage: number;
  statusProject: "pendiente" | "aceptado" | "revision";
}

export function useGetMyProjects({
  entriesPerPage,
  statusProject,
}: UseMyProjectsOptions) {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  const statusMap = {
    pendiente: "1",
    aceptado: "5",
    revision: "4",
  };

  const resetProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
  }, []);

  const fetchMyProjects = useCallback(
    async (isLoadMore = false, page = 1) => {
      setIsLoading(true);
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: entriesPerPage.toString(),
          statusProject: statusMap[statusProject],
        });

        const response = await fetch(`/api/user?${params.toString()}`, {
          signal,
        });

        if (!response.ok) {
          throw new Error(
            `Error al obtener tus propiedades: ${response.statusText}`
          );
        }

        const data = await response.json();
        const newProjects: ProjectSummary[] = data.projects;

        setProjects((prev) =>
          isLoadMore
            ? [
                ...prev,
                ...newProjects.filter(
                  (p) => !prev.some((prop) => prop.id === p.id)
                ),
              ]
            : newProjects
        );

        setTotalEntries(data.totalEntries);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setErrorProjects(error.message || "Error desconocido");
        }
      } finally {
        setIsLoading(false);
      }

      return () => controller.abort();
    },
    [entriesPerPage, statusProject]
  );

  useEffect(() => {
    fetchMyProjects(false, 1);
  }, [statusProject]);

  const fetchMoreMyProjects = useCallback(() => {
    if (!isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMyProjects(true, nextPage);
    }
  }, [currentPage, isLoading, fetchMyProjects]);

  const refreshMyProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
    fetchMyProjects(false, 1);
  }, [fetchMyProjects]);

  return {
    projects,
    totalEntries,
    fetchMoreMyProjects,
    resetProjects,
    refreshMyProjects,
    isLoading,
    errorProjects,
  };
}
