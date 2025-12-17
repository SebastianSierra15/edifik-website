"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectSummary } from "@/src/interfaces";
import { UserProjectsService } from "@/src/services/user";

interface UseMyProjectsOptions {
  entriesPerPage: number;
  statusProject: "pendiente" | "aceptado" | "revision";
}

const STATUS_MAP: Record<UseMyProjectsOptions["statusProject"], number> = {
  pendiente: 1,
  aceptado: 5,
  revision: 4,
};

export function useGetMyProjects({
  entriesPerPage,
  statusProject,
}: UseMyProjectsOptions) {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  const resetProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
  }, []);

  const fetchMyProjects = useCallback(
    async (isLoadMore = false, page = 1) => {
      setIsLoading(true);
      setErrorProjects(null);

      try {
        const { projects: newProjects, totalEntries } =
          await UserProjectsService.getMyProjects({
            page,
            pageSize: entriesPerPage,
            statusProject: STATUS_MAP[statusProject],
          });

        setProjects((prev) =>
          isLoadMore
            ? [
                ...prev,
                ...newProjects.filter((p) => !prev.some((e) => e.id === p.id)),
              ]
            : newProjects
        );

        setTotalEntries(totalEntries);
      } catch (err: any) {
        setErrorProjects(err.message || "Error al cargar proyectos");
      } finally {
        setIsLoading(false);
      }
    },
    [entriesPerPage, statusProject]
  );

  useEffect(() => {
    fetchMyProjects(false, 1);
  }, [statusProject]);

  const fetchMoreMyProjects = useCallback(() => {
    if (isLoading) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchMyProjects(true, nextPage);
  }, [currentPage, isLoading, fetchMyProjects]);

  const refreshMyProjects = useCallback(() => {
    resetProjects();
    fetchMyProjects(false, 1);
  }, [fetchMyProjects, resetProjects]);

  return {
    projects,
    totalEntries,
    isLoading,
    errorProjects,
    fetchMoreMyProjects,
    refreshMyProjects,
    resetProjects,
  };
}
