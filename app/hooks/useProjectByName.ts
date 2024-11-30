"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/definitios";

export function useProjectByName(name: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${name}`);
        
        if (!response.ok) {
          throw new Error("Propiedad no encontrada");
        }

        const data = await response.json();
        setProject(data);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [name]);

  return { project, loading, error };
}
