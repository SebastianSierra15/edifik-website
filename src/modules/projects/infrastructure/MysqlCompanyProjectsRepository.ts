import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectView } from "@/src/interfaces";
import { CompanyProjectsRepository } from "../domain/ProjectsRepository";

export class MysqlCompanyProjectsRepository
  implements CompanyProjectsRepository
{
  async getCompanyProjects(limit: number): Promise<ProjectView[]> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_company_projects(?)",
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
      images: mediaMap[row.id] ?? [],
    }));
  }
}
