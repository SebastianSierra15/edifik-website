"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

  const pageRef = useRef(1);

  const [lastFetchedFilters, setLastFetchedFilters] = useState<{
    searchTerm: string;
    selectedButtons: Record<string, number[]>;
    projectTypeId: number | null;
    showMap: boolean;
    bounds: google.maps.LatLngBounds | undefined;
  }>({
    searchTerm: "",
    selectedButtons: {},
    projectTypeId: null,
    showMap: false,
    bounds: undefined, // Cambiado de `null` a `undefined` para coincidir con `currentFilters`
  });

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
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
        searchTerm,
        selectedButtons,
        projectTypeId,
        showMap,
        bounds,
      };

      // 🔥 Permitir la carga de más páginas aunque los filtros sean los mismos
      if (
        !isLoadMore &&
        JSON.stringify(currentFilters) === JSON.stringify(lastFetchedFilters)
      ) {
        console.log(
          "⏳ [fetchProjects] No hay cambios en los filtros, omitiendo llamada."
        );
        return;
      }

      setLastFetchedFilters(currentFilters); // Guarda los últimos filtros usados
      setIsLoading(true);

      console.log(
        `📡 [fetchProjects] Ejecutando - isLoadMore: ${isLoadMore}, page: ${page}`
      );

      try {
        const startFetch = performance.now(); // Inicia medición

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

        console.log(
          `📡 [fetchProjects] URL: /api/projects?${params.toString()}`
        );

        const response = await fetch(`/api/projects?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Error fetching projects: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`📡 [fetchProjects] Datos recibidos:`, data);

        const newProjects: ProjectSummary[] = data.projects;

        const endFetch = performance.now(); // Finaliza medición
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
    [
      entriesPerPage,
      isLoading,
      searchTerm,
      selectedButtons,
      projectTypeId,
      showMap,
      bounds,
    ]
  );

  useEffect(() => {
    console.log("🔄 Fetching Projects...");

    const timeoutId = setTimeout(() => {
      fetchProjects(false, 1, showMap && bounds !== null ? bounds : undefined);
    }, 500); // Espera 500ms antes de llamar la API (reduce llamadas innecesarias)
    console.log("🔄 Fetching Projects con filtros:", {
      selectedButtons,
      searchTerm,
      projectTypeId,
      showMap,
      bounds,
    });

    return () => clearTimeout(timeoutId); // Cancela llamadas anteriores si hay nuevos cambios
  }, [searchTerm, selectedButtons, projectTypeId, showMap, bounds]);

  const fetchMoreProjects = useCallback(() => {
    if (isLoading) return; // 🚨 Previene llamadas duplicadas, pero no bloquea siempre

    setIsLoading(true); // 🔥 Activa el estado de carga antes de llamar la API

    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      console.log(
        `➡️ [fetchMoreProjects] Llamando a fetchProjects para la página: ${nextPage}`
      );

      fetchProjects(
        true,
        nextPage,
        showMap && bounds !== null ? bounds : undefined
      ).finally(() => setIsLoading(false)); // 🔥 Asegura que el estado de carga se resetee

      return nextPage;
    });
  }, [isLoading, fetchProjects, showMap, bounds]);

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
