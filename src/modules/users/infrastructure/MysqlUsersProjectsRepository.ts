import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectSummary } from "@/src/interfaces";
import {
  UsersProjectsRepository,
  GetUsersProjectsParams,
  GetUsersProjectsResult,
} from "../domain/UserRepository";

export class MysqlUsersProjectsRepository implements UsersProjectsRepository {
  async getProjectsByUser(
    params: GetUsersProjectsParams
  ): Promise<GetUsersProjectsResult> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_user_project_list(?, ?, ?)",
      [params.userId, params.page, params.pageSize]
    );

    const [projectsRows = [], mediaRows = [], [totalRow] = []] = result as any;

    const mediaMap: Record<number, any[]> = {};

    for (const media of mediaRows) {
      if (!mediaMap[media.projectId]) {
        mediaMap[media.projectId] = [];
      }
      mediaMap[media.projectId].push({
        url: media.url,
        tag: media.tag,
        projectId: media.projectId,
      });
    }

    const projects: ProjectSummary[] = projectsRows.map((row: any) => ({
      id: row.id,
      name: row.name,
      price: row.price ?? null,
      totalArea: row.area,
      bedrooms: row.bedrooms ?? null,
      bathrooms: row.bathrooms ?? null,
      parkingSpots: row.parkingSpots ?? null,
      longitude: Number(row.longitude),
      latitude: Number(row.latitude),
      address: row.address,
      city: {
        id: row.cityId,
        name: row.cityName,
        departament: {
          id: row.departamentId,
          name: row.departamentName,
        },
      },
      projectMedia: mediaMap[row.id] ?? [],
    }));

    return {
      projects,
      totalEntries: totalRow?.totalEntries ?? 0,
    };
  }
}
