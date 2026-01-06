import { db } from "@/lib/db";
import {
  CreateProjectMediaRepository,
  UpdateProjectMediaRepository,
  DeleteProjectMediaRepository,
} from "../domain/ProjectsRepository";
import { ProjectMediaInput } from "../domain/ProjectMediaInput";

export class MysqlProjectMediaRepository
  implements
    CreateProjectMediaRepository,
    UpdateProjectMediaRepository,
    DeleteProjectMediaRepository
{
  async createMany(media: ProjectMediaInput[]): Promise<void> {
    await db.query("CALL insert_multiple_project_media(?)", [
      JSON.stringify(media),
    ]);
  }

  async updateMany(media: ProjectMediaInput[]): Promise<void> {
    await db.query("CALL update_multiple_project_media(?)", [
      JSON.stringify(media),
    ]);
  }

  async deleteMany(mediaIds: number[]): Promise<void> {
    await db.query("CALL delete_multiple_project_media(?)", [
      JSON.stringify(mediaIds),
    ]);
  }
}
