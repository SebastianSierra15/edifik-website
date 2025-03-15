"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ProjectView } from "@/lib/definitios";
import { useDebouncedCallback } from "use-debounce";

interface UseGetPropertiesOptions {
  entriesPerPage: number;
  selectedButtons: Record<string, number[]>;
  projectTypeId: number | null;
  bounds?: google.maps.LatLngBounds | null;
  showMap: boolean;
}

export function useGetProperties({
  entriesPerPage,
  selectedButtons,
  projectTypeId,
  bounds = null,
  showMap,
}: UseGetPropertiesOptions) {
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  const pageRef = useRef(1);

  const [lastFetchedFilters, setLastFetchedFilters] = useState<{
    selectedButtons: Record<string, number[]>;
    projectTypeId: number | null;
    showMap: boolean;
    bounds: google.maps.LatLngBounds | undefined;
  }>({
    selectedButtons: {},
    projectTypeId: null,
    showMap: false,
    bounds: undefined,
  });

  const debouncedSearch = useDebouncedCallback((term: string) => {
    resetProjects();
  }, 300);

  const resetProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
    pageRef.current = 1;
  }, []);

  const fetchProjects = useCallback(
    async (isLoadMore = false, page = 1, bounds?: google.maps.LatLngBounds) => {
      if (isLoading) {
        console.log("⚠️ [fetchProjects] Bloqueado por isLoading");
        return;
      }

      const currentFilters = {
        selectedButtons,
        projectTypeId,
        showMap,
        bounds,
      };

      if (
        !isLoadMore &&
        JSON.stringify(currentFilters) === JSON.stringify(lastFetchedFilters)
      ) {
        console.log(
          "⏳ [fetchProjects] Filtros sin cambios, omitiendo llamada."
        );
        return;
      }

      setLastFetchedFilters(currentFilters);
      setIsLoading(true);

      console.log(
        `📡 [fetchProjects] Ejecutando - isLoadMore: ${isLoadMore}, page: ${page}`
      );

      try {
        const startFetch = performance.now();

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: entriesPerPage.toString(),
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

        console.log(
          `📡 [fetchProjects] URL: /api/realEstate?${params.toString()}`
        );

        const response = await fetch(`/api/realEstate?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Error fetching projects: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`📡 [fetchProjects] Datos recibidos:`, data);

        const newProjects: ProjectView[] = data.projects;

        const endFetch = performance.now();
        console.log(
          `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
        );
        console.log(
          `📦 Tamaño de respuesta: ${JSON.stringify(data).length} bytes`
        );

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
    },
    [entriesPerPage, isLoading, selectedButtons, projectTypeId, showMap, bounds]
  );

  useEffect(() => {
    console.log("🔄 Fetching Properties...");

    const timeoutId = setTimeout(() => {
      fetchProjects(false, 1, showMap && bounds !== null ? bounds : undefined);
    }, 500);

    console.log("🔄 Fetching Properties con filtros:", {
      selectedButtons,
      projectTypeId,
      showMap,
      bounds,
    });

    return () => clearTimeout(timeoutId);
  }, [selectedButtons, projectTypeId, showMap, bounds]);

  const fetchMoreProjects = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);

    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      console.log(
        `➡️ [fetchMoreProjects] Llamando a fetchProjects para la página: ${nextPage}`
      );

      fetchProjects(
        true,
        nextPage,
        showMap && bounds !== null ? bounds : undefined
      ).finally(() => setIsLoading(false));

      return nextPage;
    });
  }, [isLoading, fetchProjects, showMap, bounds]);

  return {
    projects,
    totalEntries,
    fetchMoreProjects,
    debouncedSearch,
    resetProjects,
    isLoading,
    errorProjects,
  };
}
