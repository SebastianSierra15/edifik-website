"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { ProjectSummary } from "@/src/interfaces";
import { ProjectService } from "@/src/services";

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
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  const lastFiltersRef = useRef<string>("");

  const resetProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
  }, []);

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    resetProjects();
  }, 300);

  const fetchProjects = useCallback(
    async (isLoadMore = false, page = 1) => {
      if (isLoading) return;

      const filtersSignature = JSON.stringify({
        searchTerm,
        selectedButtons,
        projectTypeId,
        showMap,
        bounds: showMap && bounds ? bounds.toUrlValue() : null,
      });

      if (!isLoadMore && filtersSignature === lastFiltersRef.current) return;

      lastFiltersRef.current = filtersSignature;
      setIsLoading(true);
      setErrorProjects(null);

      try {
        const { projects: newProjects, totalEntries: total } =
          await ProjectService.search({
            page,
            pageSize: entriesPerPage,
            searchTerm: searchTerm || null,
            projectTypeId,
            ...Object.fromEntries(
              Object.entries(selectedButtons).map(([key, value]) => [
                key,
                value.length ? value : null,
              ])
            ),
            ...(showMap && bounds
              ? {
                  minLat: bounds.getSouthWest().lat(),
                  maxLat: bounds.getNorthEast().lat(),
                  minLng: bounds.getSouthWest().lng(),
                  maxLng: bounds.getNorthEast().lng(),
                }
              : {}),
          });

        setProjects((prev) =>
          isLoadMore
            ? [
                ...prev,
                ...newProjects.filter((p) => !prev.some((e) => e.id === p.id)),
              ]
            : newProjects
        );

        setTotalEntries(total);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Error al cargar los proyectos";
        setErrorProjects(message);
      } finally {
        setIsLoading(false);
      }
    },
    [
      entriesPerPage,
      searchTerm,
      selectedButtons,
      projectTypeId,
      showMap,
      bounds,
      isLoading,
    ]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProjects(false, 1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    searchTerm,
    selectedButtons,
    projectTypeId,
    showMap,
    bounds,
    fetchProjects,
  ]);

  const fetchMoreProjects = useCallback(() => {
    if (isLoading) return;

    setCurrentPage((prev) => {
      const nextPage = prev + 1;
      void fetchProjects(true, nextPage);
      return nextPage;
    });
  }, [fetchProjects, isLoading]);

  const refreshProjects = useCallback(() => {
    resetProjects();
    void fetchProjects(false, 1);
  }, [fetchProjects, resetProjects]);

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
