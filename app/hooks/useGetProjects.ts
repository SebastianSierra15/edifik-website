"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ProjectSummary } from "@/lib/definitios";
import { useDebouncedCallback } from "use-debounce";

interface UseProjectsOptions {
  entriesPerPage: number;
  selectedButtons: Record<string, number[]>;
  currentProjects: ProjectSummary[];
  projectTypeId: number | null;
}

export function useGetProjects({
  entriesPerPage,
  selectedButtons,
  currentProjects,
  projectTypeId,
}: UseProjectsOptions) {
  const [projects, setProjects] = useState<ProjectSummary[]>(currentProjects);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    resetProjects();
  }, 300);

  const resetProjects = () => {
    setProjects([]);
    setCurrentPage(1);
  };

  const fetchProjects = async (isLoadMore = false, page = 1) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const params = {
        page,
        pageSize: entriesPerPage,
        searchTerm,
        projectTypeId,
        ...Object.fromEntries(
          Object.entries(selectedButtons).map(([key, value]) => [
            key,
            value.join(","),
          ])
        ),
      };

      const response = await axios.get("/api/projects", { params });
      const newProjects: ProjectSummary[] = response.data.projects;

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

      setTotalEntries(response.data.totalEntries);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, selectedButtons, projectTypeId]);

  const fetchMoreProjects = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProjects(true, nextPage);
  };

  return {
    projects,
    totalEntries,
    fetchMoreProjects,
    debouncedSearch,
    resetProjects,
    isLoading,
  };
}
