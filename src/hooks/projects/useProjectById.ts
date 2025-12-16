import { useEffect, useState } from "react";
import { ProjectDetails } from "@/src/interfaces";
import { ProjectService } from "@/src/services";

export function useProjectById(
  id?: number,
  isProject?: boolean,
  isAdmin?: boolean
) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const { project } = await ProjectService.getById(
          id,
          isProject,
          isAdmin
        );
        setProject(project);
      } catch (err: any) {
        setError(err.message || "No se pudo cargar el proyecto");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, isProject, isAdmin]);

  return { project, loading, error };
}
