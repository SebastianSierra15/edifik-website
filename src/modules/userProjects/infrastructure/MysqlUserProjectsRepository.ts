import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectSummary } from "@/src/interfaces";
import {
  GetUserProjectsParams,
  GetUserProjectsResult,
  UserProjectsRepository,
} from "../domain/UserProjectsRepository";

type ProjectRow = RowDataPacket & {
  id: number;
  name: string;
  price: number | null;
  area: number;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpots: number | null;
  longitude: number;
  latitude: number;
  address: string;
  cityId: number;
  cityName: string;
  departamentId: number;
  departamentName: string;
};

type MediaRow = RowDataPacket & {
  url: string;
  tag: string;
  projectId: number;
};

type TotalRow = RowDataPacket & { totalEntries: number };

export class MysqlUserProjectsRepository implements UserProjectsRepository {
  async getUserProjects(
    params: GetUserProjectsParams
  ): Promise<GetUserProjectsResult> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_user_projects(?, ?, ?, ?)",
      [params.userId, params.page, params.pageSize, params.statusProject]
    );

    const [projectsRows = [], mediaRows = [], [totalRow] = []] = result as [
      ProjectRow[],
      MediaRow[],
      TotalRow[],
    ];

    const projectMediaMap: Record<
      number,
      { url: string; tag: string; projectId: number }[]
    > = {};

    for (const media of mediaRows) {
      if (!projectMediaMap[media.projectId])
        projectMediaMap[media.projectId] = [];
      projectMediaMap[media.projectId].push({
        url: media.url,
        tag: media.tag,
        projectId: media.projectId,
      });
    }

    const projects: ProjectSummary[] = projectsRows.map((row) => ({
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
      projectMedia: projectMediaMap[row.id] ?? [],
    }));

    return {
      projects,
      totalEntries: totalRow?.totalEntries ?? 0,
    };
  }

  async deleteUserProject(params: {
    projectId: number;
    userId: number;
  }): Promise<void> {
    await db.query("CALL delete_user_project(?, ?)", [
      params.projectId,
      params.userId,
    ]);
  }
}
