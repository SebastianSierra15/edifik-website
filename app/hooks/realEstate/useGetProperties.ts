"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ProjectView } from "@/lib/definitios";

interface UseGetPropertiesOptions {
  entriesPerPage: number;
  selectedButtons: Record<string, number[]>;
  projectTypeId: number | null;
  bounds?: google.maps.LatLngBounds | null;
  showMap: boolean;
  searchCoords?: { latitude: number; longitude: number } | null;
}

export function useGetProperties({
  entriesPerPage,
  selectedButtons,
  projectTypeId,
  bounds = null,
  showMap,
  searchCoords = null,
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
    searchCoords: { latitude: number; longitude: number } | null;
  }>({
    selectedButtons: {},
    projectTypeId: null,
    showMap: false,
    bounds: undefined,
    searchCoords: null,
  });

  const resetProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
    pageRef.current = 1;
  }, []);

  const fetchProjects = useCallback(
    async (isLoadMore = false, page = 1, bounds?: google.maps.LatLngBounds) => {
      if (isLoading) {
        return;
      }

      const currentFilters = {
        selectedButtons,
        projectTypeId,
        showMap,
        bounds,
        searchCoords,
      };

      const areFiltersEqual = (
        a: typeof currentFilters,
        b: typeof lastFetchedFilters
      ): boolean => {
        return (
          JSON.stringify(a.selectedButtons) ===
            JSON.stringify(b.selectedButtons) &&
          a.projectTypeId === b.projectTypeId &&
          a.showMap === b.showMap &&
          JSON.stringify(a.bounds) === JSON.stringify(b.bounds) &&
          ((!a.searchCoords && !b.searchCoords) ||
            (a.searchCoords?.latitude === b.searchCoords?.latitude &&
              a.searchCoords?.longitude === b.searchCoords?.longitude))
        );
      };

      if (!isLoadMore && areFiltersEqual(currentFilters, lastFetchedFilters)) {
        return;
      }

      setLastFetchedFilters(currentFilters);
      setIsLoading(true);

      try {
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

        if (searchCoords) {
          params.append("latitude", searchCoords.latitude.toString());
          params.append("longitude", searchCoords.longitude.toString());
        }

        const response = await fetch(`/api/realEstate?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Error fetching projects: ${response.statusText}`);
        }

        const data = await response.json();
        const newProjects: ProjectView[] = data.projects;

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
      selectedButtons,
      projectTypeId,
      showMap,
      bounds,
      searchCoords,
    ]
  );

  useEffect(() => {
    setCurrentPage(1);
    pageRef.current = 1;

    const timeoutId = setTimeout(() => {
      fetchProjects(false, 1, showMap && bounds !== null ? bounds : undefined);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [selectedButtons, projectTypeId, showMap, bounds, searchCoords]);

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

  return {
    projects,
    totalEntries,
    fetchMoreProjects,
    resetProjects,
    isLoading,
    errorProjects,
  };
}
