"use client";

import { useState, useEffect } from "react";
import { ProjectView } from "@/lib/definitios";

export function useHomeProjects(numberProjects: number, isProperty: boolean) {
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/projects/home/${isProperty ? "realEstate" : "company"}?numberProjects=${numberProjects}`
        );

        if (!response.ok) {
          throw new Error(
            `Error fetching company projects: ${response.statusText}`
          );
        }

        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error: any) {
        setError(error.message || "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [numberProjects]);

  return { projects, isLoading, error };
}
