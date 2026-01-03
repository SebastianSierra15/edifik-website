"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { LatLngBounds } from "leaflet";
import { ProjectView } from "@/src/interfaces";
import { RealEstateService } from "@/src/services/realEstate";

interface UseGetPropertiesOptions {
  entriesPerPage: number;
  selectedButtons: Record<string, number[]>;
  projectTypeId: number | null;
  bounds?: LatLngBounds | null;
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
  const boundsRef = useRef<LatLngBounds | null>(bounds);
  const isLoadingRef = useRef(false);
  const lastQueryRef = useRef<string>("");
  const lastBoundsRef = useRef<string>("");

  const resetProjects = useCallback(() => {
    setProjects([]);
    setCurrentPage(1);
    pageRef.current = 1;
  }, []);

  useEffect(() => {
    boundsRef.current = bounds ?? null;
  }, [bounds]);

  const fetchProjects = useCallback(
    async (isLoadMore = false, page = 1) => {
      if (isLoadingRef.current) return;

      const activeBounds = boundsRef.current;
      const boundsSignature =
        showMap && activeBounds ? activeBounds.toBBoxString() : null;
      const querySignature = JSON.stringify({
        selectedButtons,
        projectTypeId,
        showMap,
        bounds: boundsSignature,
        searchCoords,
      });

      if (!isLoadMore && querySignature === lastQueryRef.current) {
        return;
      }

      if (!isLoadMore) {
        lastQueryRef.current = querySignature;
      }
      isLoadingRef.current = true;
      setIsLoading(true);
      setErrorProjects(null);

      try {
        const response = await RealEstateService.searchProperties({
          page,
          pageSize: entriesPerPage,
          selectedButtons,
          projectTypeId,
          bounds:
            showMap && activeBounds
              ? {
                  minLat: activeBounds.getSouthWest().lat,
                  maxLat: activeBounds.getNorthEast().lat,
                  minLng: activeBounds.getSouthWest().lng,
                  maxLng: activeBounds.getNorthEast().lng,
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
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [
      entriesPerPage,
      selectedButtons,
      projectTypeId,
      showMap,
      searchCoords,
    ]
  );

  useEffect(() => {
    resetProjects();
    lastQueryRef.current = "";
    lastBoundsRef.current = "";
    const timeout = setTimeout(() => {
      fetchProjects(false, 1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [selectedButtons, projectTypeId, showMap, searchCoords, fetchProjects, resetProjects]);

  useEffect(() => {
    if (!showMap || !bounds) return;

    const boundsSignature = bounds.toBBoxString();
    if (boundsSignature === lastBoundsRef.current) {
      return;
    }

    lastBoundsRef.current = boundsSignature;

    const timeout = setTimeout(() => {
      fetchProjects(false, 1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [bounds, showMap, fetchProjects]);

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
