import { useState } from "react";

export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (projectData: any): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error al crear la propiedad.");
      }

      const data = await response.json();
      return data.projectId;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error };
}
