import { ProjectDetails } from "@/src/interfaces";
import { ProjectService } from "@/src/services/projects";

export async function getProjectById(
  id: number,
  isProject = false,
  isAdmin = false
): Promise<ProjectDetails | null> {
  try {
    const { project } = await ProjectService.getByIdServer(
      id,
      isProject,
      isAdmin
    );
    return project;
  } catch (error) {
    console.error("Error al obtener proyecto:", error);
    return null;
  }
}
