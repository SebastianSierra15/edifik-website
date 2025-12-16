import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectSummary } from "@/src/interfaces";
import { escapeSearchTerm } from "@/utils/escapeSearchTerm";
import { AdminProjectsRepository } from "../domain/ProjectsRepository";
import { AdminProjectsSearchFilters } from "../domain/AdminProjectsSearchFilters";

export class MysqlAdminProjectsRepository implements AdminProjectsRepository {
  async search(filters: AdminProjectsSearchFilters) {
    const toJson = (arr?: number[] | null) =>
      arr ? JSON.stringify(arr) : null;

    const safeSearchTerm = filters.searchTerm
      ? escapeSearchTerm(filters.searchTerm)
      : null;

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_projects_admin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        filters.page,
        filters.pageSize,
        toJson(filters.cities),
        toJson(filters.propertyTypes),
        toJson(filters.housingTypes),
        toJson(filters.memberships),
        filters.price ?? null,
        filters.area ?? null,
        filters.bedrooms ?? null,
        filters.bathrooms ?? null,
        filters.lobbies ?? null,
        filters.projectTypeId,
        toJson(filters.commonAreas),
        toJson(filters.nearbyServices),
        safeSearchTerm,
        filters.minLat ?? null,
        filters.maxLat ?? null,
        filters.minLng ?? null,
        filters.maxLng ?? null,
      ]
    );

    const [projectsRows = [], projectMediaRows = [], [totalEntriesRow] = []] =
      result;

    const totalEntries = (totalEntriesRow as any)?.totalEntries ?? 0;

    const projectMediaMap: Record<number, ProjectSummary["projectMedia"]> = {};
    projectMediaRows.forEach((media: any) => {
      projectMediaMap[media.projectId] ||= [];
      projectMediaMap[media.projectId].push({
        url: media.url,
        tag: media.tag,
        projectId: media.projectId,
      });
    });

    const projects: ProjectSummary[] = projectsRows.map((row: any) => ({
      id: row.id,
      name: row.name,
      price: row.price || null,
      totalArea: row.area,
      bedrooms: row.bedrooms || null,
      bathrooms: row.bathrooms || null,
      parkingSpots: row.parkingSpots || null,
      longitude: row.longitude as number,
      latitude: row.latitude as number,
      address: row.address,
      city: {
        id: row.cityId,
        name: row.cityName,
        departament: {
          id: row.departamentId,
          name: row.departamentName,
        },
      },
      email: row.email ?? null,
      projectMedia: projectMediaMap[row.id] || [],
    }));

    return { projects, totalEntries };
  }
}
