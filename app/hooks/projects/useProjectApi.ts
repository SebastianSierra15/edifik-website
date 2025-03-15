import { useState } from "react";
import { ProjectData } from "@/lib/definitios";

export function useProjectApi() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitProject = async (
    projectData: ProjectData | number,
    action: "create" | "edit" | "delete"
  ): Promise<number | boolean | null> => {
    setIsProcessing(true);
    setError(null);
    try {
      let method = "POST";
      let body: string | undefined = JSON.stringify(projectData);
      let url = "/api/projects";

      if (action === "edit") {
        method = "PUT";
      } else if (action === "delete") {
        method = "DELETE";
        body = undefined;
        url = `/api/projects?id=${projectData}`;
      }

      const startFetch = performance.now(); // Inicia medición del tiempo de fetch

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      const endFetch = performance.now(); // Finaliza medición del tiempo de fetch
      const serverTiming = response.headers.get("Server-Timing");

      console.log(
        `⏱️ Tiempo total de fetch: ${(endFetch - startFetch).toFixed(2)}ms`
      );
      console.log("⏳ Server Timing Metrics:", serverTiming);

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error al procesar el proyecto.");
      }

      if (action === "create") {
        const data = await response.json();
        return data.projectId;
      }

      return true;
    } catch (err: any) {
      console.error("Error al procesar el proyecto:", err.message);
      setError(err.message || "Error desconocido");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return { submitProject, isProcessing, error };
}
