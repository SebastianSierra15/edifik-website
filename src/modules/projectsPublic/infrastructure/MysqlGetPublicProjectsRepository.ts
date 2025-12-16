import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectView } from "@/src/interfaces";
import { GetPublicProjectsRepository } from "../domain/PublicProjectsRepository";

export class MysqlGetPublicProjectsRepository
  implements GetPublicProjectsRepository
{
  async getAll() {
    const [result] = await db.query<RowDataPacket[][]>("CALL get_projects()");

    const [projectsRows = [], projectMediaRows = [], [totalRow] = []] = result;

    const mediaMap: Record<number, ProjectView["images"]> = {};

    for (const media of projectMediaRows as any[]) {
      mediaMap[media.projectId] ||= [];
      mediaMap[media.projectId].push({
        url: media.url,
        tag: media.tag,
        projectId: media.projectId,
      });
    }

    const projects: ProjectView[] = (projectsRows as any[]).map((row) => ({
      id: row.id,
      name: row.name,
      cityName: row.cityName,
      price: row.price,
      area: row.area,
      bathrooms: row.bathrooms,
      parkingSpots: row.parkingSpots,
      bedrooms: row.bedrooms,
      images: mediaMap[row.id] || [],
    }));

    return {
      projects,
      total: totalRow?.totalEntries ?? 0,
    };
  }
}
