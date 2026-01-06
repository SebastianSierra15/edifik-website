"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  const lastFetchedKeyRef = useRef<string | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const currentPageRef = useRef(1);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
    };
  }, []);

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    resetProjects();
  }, 300);

  const resetProjects = useCallback(() => {
    setProjects([]);
    currentPageRef.current = 1;
  }, []);

  const fetchProjects = useCallback(
    async (
      isLoadMore = false,
      page = 1,
      mapBounds?: LatLngBounds,
      force = false
    ) => {
      if (isLoadMore && isLoading) return;

      const boundsKey = mapBounds ? mapBounds.toBBoxString() : null;
      const currentFilters = {
        searchTerm,
        selectedButtons,
        projectTypeId,
        showMap,
        boundsKey,
      };

      const currentKey = JSON.stringify(currentFilters);
      if (!isLoadMore && !force && currentKey === lastFetchedKeyRef.current) {
        return;
      }

      lastFetchedKeyRef.current = currentKey;

      if (!isLoadMore) {
        currentPageRef.current = page;
      }

      requestControllerRef.current?.abort();
      const controller = new AbortController();
      requestControllerRef.current = controller;

      setIsLoading(true);
      setErrorProjects(null);

      try {
        const { projects: newProjects, totalEntries: total } =
          await ProjectService.search(
            {
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
                  (p) => !prev.some((prop) => prop.id === p.id)
                ),
              ]
            : newProjects
        );

        setTotalEntries(total);
      } catch (error: unknown) {
        const isAbortError =
          error instanceof Error && error.name === "AbortError";
        if (!isAbortError) {
          if (requestControllerRef.current !== controller) {
            return;
          }
          const message = error instanceof Error ? error.message : null;
          setErrorProjects(message || "Error desconocido");
        }
      } finally {
        if (requestControllerRef.current === controller) {
          requestControllerRef.current = null;
          setIsLoading(false);
        }
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
    fetchProjects(false, 1, showMap && bounds !== null ? bounds : undefined);
  }, [searchTerm, selectedButtons, projectTypeId, showMap, bounds, fetchProjects]);

  const fetchMoreProjects = useCallback(() => {
    if (isLoading) return;

    const nextPage = currentPageRef.current + 1;
    currentPageRef.current = nextPage;
    fetchProjects(
      true,
      nextPage,
      showMap && bounds !== null ? bounds : undefined
    );
  }, [isLoading, fetchProjects, showMap, bounds]);

  const refreshProjects = useCallback(() => {
    setProjects([]);
    currentPageRef.current = 1;
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
