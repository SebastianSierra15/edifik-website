import { ProjectDetails } from "@/src/interfaces";
import { ProjectService } from "@/src/services/projects";

export async function getProjectById(
  id: number,
  isProject = false,
  isAdmin = false
): Promise<ProjectDetails | null> {
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  try {
    const { project } = await ProjectService.getByIdServer(
      id,
      isProject,
      isAdmin
    );
    return project;
  } catch (error) {
    const message = error instanceof Error ? error.message : null;
    const isNotFound = message === "Proyecto no encontrado";
    const isInvalidId = message?.startsWith("ID de proyecto") ?? false;

    if (!isNotFound && !isInvalidId) {
      console.error("Error al obtener proyecto:", error);
    }
    return null;
  }
}
