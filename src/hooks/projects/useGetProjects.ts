"use client";

import { useState, useEffect, useCallback } from "react";
import type { LatLngBounds } from "leaflet";
import { useDebouncedCallback } from "use-debounce";
import type { ProjectSummary } from "@/src/interfaces";
import { ProjectService } from "@/src/services/projects";

interface UseProjectsOptions {
  entriesPerPage: number;
  selectedButtons: Record<string, number[]>;
  currentProjects: ProjectSummary[];
  projectTypeId: number | null;
  bounds?: LatLngBounds | null;
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

  const [lastFetchedFilters, setLastFetchedFilters] = useState<{
    searchTerm: string;
    selectedButtons: Record<string, number[]>;
    projectTypeId: number | null;
    showMap: boolean;
    boundsKey: string | null;
  }>({
    searchTerm: "",
    selectedButtons: {},
    projectTypeId: null,
    showMap: false,
    boundsKey: null,
  });

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    resetProjects();
  }, 300);

  const resetProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
  }, []);

  const fetchProjects = useCallback(
    async (isLoadMore = false, page = 1, mapBounds?: LatLngBounds, force = false) => {
      if (isLoading) return;

      const boundsKey = mapBounds ? mapBounds.toBBoxString() : null;
      const currentFilters = {
        searchTerm,
        selectedButtons,
        projectTypeId,
        showMap,
        boundsKey,
      };

      if (
        !isLoadMore &&
        !force &&
        JSON.stringify(currentFilters) === JSON.stringify(lastFetchedFilters)
      ) {
        return;
      }

      setLastFetchedFilters(currentFilters);
      setIsLoading(true);

      try {
        const { projects: newProjects, totalEntries: total } =
          await ProjectService.search({
            page,
            pageSize: entriesPerPage,
            searchTerm,
            projectTypeId: projectTypeId || null,
            ...Object.fromEntries(
              Object.entries(selectedButtons).map(([key, value]) => [
                key,
                value,
              ])
            ),
            ...(mapBounds
              ? {
                  minLat: mapBounds.getSouthWest().lat,
                  maxLat: mapBounds.getNorthEast().lat,
                  minLng: mapBounds.getSouthWest().lng,
                  maxLng: mapBounds.getNorthEast().lng,
                }
              : {}),
          });

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

        setTotalEntries(total);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setErrorProjects(error.message || "Error desconocido");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      entriesPerPage,
      isLoading,
      searchTerm,
      selectedButtons,
      projectTypeId,
      showMap,
    ]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProjects(false, 1, showMap && bounds !== null ? bounds : undefined);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedButtons, projectTypeId, showMap, bounds, fetchProjects]);

  const fetchMoreProjects = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;

      fetchProjects(
        true,
        nextPage,
        showMap && bounds !== null ? bounds : undefined
      ).finally(() => setIsLoading(false));

      return nextPage;
    });
  }, [isLoading, fetchProjects, showMap, bounds]);

  const refreshProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
    fetchProjects(
      false,
      1,
      showMap && bounds !== null ? bounds : undefined,
      true
    );
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
