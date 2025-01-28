"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectSummary } from "@/lib/definitios";
import { useDebouncedCallback } from "use-debounce";

interface UseProjectsOptions {
  entriesPerPage: number;
  selectedButtons: Record<string, number[]>;
  currentProjects: ProjectSummary[];
  projectTypeId: number | null;
  bounds?: google.maps.LatLngBounds | null;
  showMap: boolean;
}

export function useGetProjects({
  entriesPerPage,
  selectedButtons,
  currentProjects,
  projectTypeId,
  bounds = null,
  showMap,
}: UseProjectsOptions) {
  const [projects, setProjects] = useState<ProjectSummary[]>(currentProjects);
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

  const fetchProjects = useCallback(
    async (isLoadMore = false, page = 1, bounds?: google.maps.LatLngBounds) => {
      if (isLoading) return;
      setIsLoading(true);
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: entriesPerPage.toString(),
          searchTerm,
          ...(projectTypeId ? { projectTypeId: projectTypeId.toString() } : {}),
          ...Object.fromEntries(
            Object.entries(selectedButtons).map(([key, value]) => [
              key,
              value.join(","),
            ])
          ),
        });

        if (bounds) {
          params.append("minLat", bounds.getSouthWest().lat().toString());
          params.append("maxLat", bounds.getNorthEast().lat().toString());
          params.append("minLng", bounds.getSouthWest().lng().toString());
          params.append("maxLng", bounds.getNorthEast().lng().toString());
        }

        const response = await fetch(`/api/projects?${params.toString()}`, {
          signal,
        });

        if (!response.ok) {
          throw new Error(`Error fetching projects: ${response.statusText}`);
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
    [entriesPerPage, isLoading, searchTerm, selectedButtons, projectTypeId]
  );

  useEffect(() => {
    fetchProjects(false, 1, showMap && bounds !== null ? bounds : undefined);
  }, [searchTerm, selectedButtons, projectTypeId, showMap, bounds]);

  const fetchMoreProjects = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProjects(
      true,
      nextPage,
      showMap && bounds !== null ? bounds : undefined
    );
  }, [currentPage, fetchProjects]);

  const refreshProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
    fetchProjects(false, 1, showMap && bounds !== null ? bounds : undefined);
  }, [fetchProjects, showMap, bounds]);

  return {
    projects,
    totalEntries,
    fetchMoreProjects,
    debouncedSearch,
    resetProjects,
    refreshProjects,
    isLoading,
    errorProjects,
  };
}
