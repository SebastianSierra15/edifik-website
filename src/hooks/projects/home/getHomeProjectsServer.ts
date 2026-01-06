import { ProjectView } from "@/src/interfaces";
import { ProjectHomeService } from "@/src/services/projects";

export async function getHomeProjectsServer(
  numberProjects: number,
  isProperty: boolean
): Promise<ProjectView[] | null> {
  try {
    const { projects } = await ProjectHomeService.getHomeProjectsServer({
      numberProjects,
      isProperty,
    });
    return projects ?? [];
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    return null;
  }
}
