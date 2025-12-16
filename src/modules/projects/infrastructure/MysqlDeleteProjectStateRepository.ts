import { db } from "@/lib/db";
import { DeleteProjectStateRepository } from "../domain/ProjectsRepository";

export class MysqlDeleteProjectStateRepository
  implements DeleteProjectStateRepository
{
  async deleteState(projectId: number, userId: number): Promise<void> {
    await db.query("CALL delete_project_state(?, ?)", [projectId, userId]);
  }
}
