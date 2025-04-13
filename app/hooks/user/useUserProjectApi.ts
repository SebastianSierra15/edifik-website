import { useState } from "react";
import { ProjectData } from "@/lib/definitios";

export function useUserProjectApi() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitUserProject = async (
    projectData: ProjectData | number,
    action: "create" | "edit" | "delete"
  ): Promise<number | boolean | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      let method = "POST";
      let body: string | undefined = JSON.stringify(projectData);
      let url = "/api/user";

      if (action === "edit") {
        method = "PUT";
      } else if (action === "delete") {
        method = "DELETE";
        body = undefined;
        url = `/api/user?id=${projectData}`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error al procesar tu propiedad.");
      }

      if (action === "create") {
        const data = await response.json();
        return data.projectId;
      }

      return true;
    } catch (err: any) {
      console.error("Error al procesar tu propiedad:", err.message);
      setError(err.message || "Error desconocido");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return { submitUserProject, isProcessing, error };
}
