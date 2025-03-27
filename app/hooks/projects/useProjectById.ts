"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/definitios";

interface ProjectData {
  project: Project;
}

export function useProjectById(id?: number) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const startFetch = performance.now(); // Inicia medición del tiempo de fetch

        const response = await fetch(`/api/projects/${id}`);

        const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
        const serverTiming = response.headers.get("Server-Timing");

        console.log(
          `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
        );
        console.log("⏳ Server Timing Metrics:", serverTiming);

        if (!response.ok) {
          throw new Error("Propiedad no encontrada");
        }

        const data: ProjectData = await response.json();
        setProject(data.project);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, loading, error };
}
