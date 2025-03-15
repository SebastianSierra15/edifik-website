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
        const startFetch = performance.now(); // Inicia medición

        const response = await fetch(
          `/api/projects/home/${isProperty ? "realEstate" : "company"}?numberProjects=${numberProjects}`
        );

        if (!response.ok) {
          throw new Error(
            `Error fetching company projects: ${response.statusText}`
          );
        }

        const serverTiming = response.headers.get("Server-Timing");
        console.log("⏳ Server Timing Metrics:", serverTiming);

        const data = await response.json();
        setProjects(data.projects || []);

        const endFetch = performance.now(); // Finaliza medición
        console.log(
          `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
        );
        console.log(
          `📦 Tamaño de respuesta: ${JSON.stringify(data).length} bytes`
        );
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
