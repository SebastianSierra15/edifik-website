import { ProjectView } from "@/src/interfaces";
import { ProjectHomeService } from "@/src/services/projects";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

export async function getHomeProjectsServer(
  numberProjects: number,
  isProperty: boolean
): Promise<ProjectView[] | null> {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return [];
  }

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
