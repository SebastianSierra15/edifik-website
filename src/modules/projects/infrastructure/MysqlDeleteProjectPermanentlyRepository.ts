import { db } from "@/lib/db";
import { DeleteProjectPermanentlyRepository } from "../domain/ProjectsRepository";

export class MysqlDeleteProjectPermanentlyRepository
  implements DeleteProjectPermanentlyRepository
{
  async deletePermanently(projectId: number, userId: number): Promise<void> {
    await db.query("CALL delete_project(?, ?)", [projectId, userId]);
  }
}
