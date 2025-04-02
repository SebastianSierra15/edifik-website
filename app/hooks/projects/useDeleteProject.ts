import { useState, useCallback } from "react";

const useDeleteProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const deleteProject = useCallback(async (projectId: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar el proyecto.");
      }

      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error("❌ Error al eliminar el proyecto:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteProject, loading, error, success };
};

export default useDeleteProject;
