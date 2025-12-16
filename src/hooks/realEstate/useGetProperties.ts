"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ProjectView } from "@/src/interfaces";
import { RealEstateService } from "@/src/services";

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
  const lastFiltersRef = useRef<string>("");

  const resetProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
    pageRef.current = 1;
  }, []);

  const fetchProjects = useCallback(
    async (isLoadMore = false, page = 1) => {
      if (isLoading) return;

      const filterSignature = JSON.stringify({
        selectedButtons,
        projectTypeId,
        showMap,
        bounds: showMap && bounds ? bounds.toUrlValue() : null,
        searchCoords,
      });

      if (!isLoadMore && filterSignature === lastFiltersRef.current) {
        return;
      }

      lastFiltersRef.current = filterSignature;
      setIsLoading(true);
      setErrorProjects(null);

      try {
        const response = await RealEstateService.searchProperties({
          page,
          pageSize: entriesPerPage,
          selectedButtons,
          projectTypeId,
          bounds:
            showMap && bounds
              ? {
                  minLat: bounds.getSouthWest().lat(),
                  maxLat: bounds.getNorthEast().lat(),
                  minLng: bounds.getSouthWest().lng(),
                  maxLng: bounds.getNorthEast().lng(),
                }
              : undefined,
          searchCoords,
        });

        setProjects((prev) =>
          isLoadMore
            ? [
                ...prev,
                ...response.projects.filter(
                  (p) => !prev.some((e) => e.id === p.id)
                ),
              ]
            : response.projects
        );

        setTotalEntries(response.totalEntries);
      } catch (error: any) {
        setErrorProjects(error.message || "Error al cargar propiedades");
      } finally {
        setIsLoading(false);
      }
    },
    [
      entriesPerPage,
      selectedButtons,
      projectTypeId,
      showMap,
      bounds,
      searchCoords,
      isLoading,
    ]
  );

  useEffect(() => {
    resetProjects();
    const timeout = setTimeout(() => {
      fetchProjects(false, 1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [selectedButtons, projectTypeId, showMap, bounds, searchCoords]);

  const fetchMoreProjects = useCallback(() => {
    if (isLoading) return;

    setCurrentPage((prev) => {
      const next = prev + 1;
      fetchProjects(true, next);
      return next;
    });
  }, [fetchProjects, isLoading]);

  return {
    projects,
    totalEntries,
    fetchMoreProjects,
    resetProjects,
    isLoading,
    errorProjects,
  };
}
