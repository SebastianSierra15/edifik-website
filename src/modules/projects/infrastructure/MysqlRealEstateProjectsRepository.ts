import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectView } from "@/src/interfaces";
import { RealEstateProjectsRepository } from "../domain/ProjectsRepository";

export class MysqlRealEstateProjectsRepository
  implements RealEstateProjectsRepository
{
  async getRealEstateProjects(limit: number): Promise<ProjectView[]> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_real_estate_projects(?)",
      [limit]
    );

    const [projectsRows = [], projectMediaRows = []] = result;

    const mediaMap: Record<
      number,
      { url: string; tag: string; projectId: number }[]
    > = {};

    (projectMediaRows as RowDataPacket[]).forEach((media) => {
      mediaMap[media.projectId] ||= [];
      mediaMap[media.projectId].push({
        url: media.url,
        tag: media.tag,
        projectId: media.projectId,
      });
    });

    return (projectsRows as RowDataPacket[]).map((row) => ({
      id: row.id,
      name: row.name,
      cityName: row.cityName,
      price: row.price,
      area: row.area,
      bathrooms: row.bathrooms,
      parkingSpots: row.parkingSpots,
      bedrooms: row.bedrooms,
      images: mediaMap[row.id] ?? [],
    }));
  }
}
