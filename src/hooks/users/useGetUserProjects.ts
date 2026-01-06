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
  const isLoadingRef = useRef(false);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

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
      if (isLoadMore && isLoadingRef.current) return;

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
      } catch (error: unknown) {
        const isAbortError =
          error instanceof Error && error.name === "AbortError";
        if (!isAbortError) {
          if (requestControllerRef.current !== controller) {
            return;
          }
          const message = error instanceof Error ? error.message : null;
          setErrorProjects(message || "Error al cargar proyectos");
        }
      } finally {
        if (requestControllerRef.current === controller) {
          requestControllerRef.current = null;
          setIsLoading(false);
        }
      }
    },
    [entriesPerPage, searchTerm, userId]
  );

  useEffect(() => {
    fetchUserProjects(false, 1);
  }, [fetchUserProjects]);

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
