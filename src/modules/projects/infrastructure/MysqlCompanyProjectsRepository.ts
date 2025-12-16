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

    projectMediaRows.forEach((media: any) => {
      mediaMap[media.projectId] ||= [];
      mediaMap[media.projectId].push({
        url: media.url,
        tag: media.tag,
        projectId: media.projectId,
      });
    });

    return projectsRows.map((row: any) => ({
      id: row.id,
      name: row.name,
      cityName: row.cityName,
      images: mediaMap[row.id] ?? [],
    }));
  }
}
