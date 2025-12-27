"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ProjectSummary } from "@/src/interfaces";
import { UserService } from "@/src/services/users";

interface UseUserProjectsOptions {
  userId: number;
  entriesPerPage: number;
}

export function useGetUserProjects({
  userId,
  entriesPerPage,
}: UseUserProjectsOptions) {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
    };
  }, []);

  const resetProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
  }, []);

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    resetProjects();
  }, 300);

  const fetchUserProjects = useCallback(
    async (isLoadMore = false, page = 1) => {
      if (userId <= 0) return;
      if (isLoadMore && isLoading) return;

      requestControllerRef.current?.abort();
      const controller = new AbortController();
      requestControllerRef.current = controller;

      setIsLoading(true);
      setErrorProjects(null);

      try {
        const { projects: newProjects, totalEntries } =
          await UserService.getUserProjects(
            {
              userId,
              page,
              pageSize: entriesPerPage,
              searchTerm,
            },
            { signal: controller.signal }
          );

        if (requestControllerRef.current !== controller) {
          return;
        }

        setProjects((prev) =>
          isLoadMore
            ? [
                ...prev,
                ...newProjects.filter(
                  (p) => !prev.some((existing) => existing.id === p.id)
                ),
              ]
            : newProjects
        );

        setTotalEntries(totalEntries);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          if (requestControllerRef.current !== controller) {
            return;
          }
          setErrorProjects(error.message || "Error al cargar proyectos");
        }
      } finally {
        if (requestControllerRef.current === controller) {
          requestControllerRef.current = null;
          setIsLoading(false);
        }
      }
    },
    [entriesPerPage, isLoading, searchTerm, userId]
  );

  useEffect(() => {
    fetchUserProjects(false, 1);
  }, [searchTerm, userId]);

  const fetchMoreUserProjects = useCallback(() => {
    if (isLoading) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchUserProjects(true, nextPage);
  }, [currentPage, fetchUserProjects, isLoading]);

  const refreshUserProjects = useCallback(() => {
    resetProjects();
    fetchUserProjects(false, 1);
  }, [fetchUserProjects, resetProjects]);

  return {
    projects,
    totalEntries,
    isLoading,
    errorProjects,
    debouncedSearch,
    fetchMoreUserProjects,
    refreshUserProjects,
    resetProjects,
  };
}
