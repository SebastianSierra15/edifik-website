"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectSummary } from "@/lib/definitios";
import { useDebouncedCallback } from "use-debounce";

interface UseUserProjectsOptions {
  userId: number;
  entriesPerPage: number;
}

export function useGetUserProjects({
  userId,
  entriesPerPage,
}: UseUserProjectsOptions) {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    resetProjects();
  }, 300);

  const resetProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
  }, []);

  const fetchUserProjects = useCallback(
    async (isLoadMore = false, page = 1) => {
      if (isLoading || userId <= 0) return;
      setIsLoading(true);
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const params = new URLSearchParams({
          userId: userId.toString(),
          page: page.toString(),
          pageSize: entriesPerPage.toString(),
          searchTerm,
        });

        const response = await fetch(
          `/api/users/projects?${params.toString()}`,
          { signal }
        );

        if (!response.ok) {
          throw new Error(
            `Error fetching user projects: ${response.statusText}`
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
    [entriesPerPage, isLoading, searchTerm, userId]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUserProjects(false, 1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, userId]);

  const fetchMoreUserProjects = useCallback(() => {
    if (!isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchUserProjects(true, nextPage);
    }
  }, [currentPage, isLoading, fetchUserProjects]);

  const refreshUserProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
    fetchUserProjects(false, 1);
  }, [fetchUserProjects]);

  return {
    projects,
    totalEntries,
    fetchMoreUserProjects,
    debouncedSearch,
    resetProjects,
    refreshUserProjects,
    isLoading,
    errorProjects,
  };
}
