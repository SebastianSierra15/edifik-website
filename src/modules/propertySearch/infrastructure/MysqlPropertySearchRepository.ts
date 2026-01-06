import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectView } from "@/src/interfaces";
import { PropertySearchRepository } from "../domain/PropertySearchRepository";
import { PropertySearchQuery } from "../domain/PropertySearchQuery";

export class MysqlPropertySearchRepository implements PropertySearchRepository {
  async search(filters: PropertySearchQuery) {
    const toJson = (arr?: number[] | null) =>
      arr ? JSON.stringify(arr) : null;

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_properties(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        filters.page,
        filters.pageSize,
        toJson(filters.cities),
        toJson(filters.propertyTypes),
        toJson(filters.housingTypes),
        filters.price ?? null,
        filters.area ?? null,
        filters.bedrooms ?? null,
        filters.bathrooms ?? null,
        filters.lobbies ?? null,
        toJson(filters.commonAreas),
        toJson(filters.nearbyServices),
        filters.projectTypeId,
        filters.minLat ?? null,
        filters.maxLat ?? null,
        filters.minLng ?? null,
        filters.maxLng ?? null,
        filters.latitude ?? null,
        filters.longitude ?? null,
      ]
    );

    const [projectsRows = [], mediaRows = [], [totalRow] = []] = result;

    const mediaMap: Record<number, ProjectView["images"]> = {};

    (mediaRows as RowDataPacket[]).forEach((m) => {
      mediaMap[m.projectId] ||= [];
      mediaMap[m.projectId].push({
        url: m.url,
        tag: m.tag,
        projectId: m.projectId,
      });
    });

    const projects: ProjectView[] = (projectsRows as RowDataPacket[]).map(
      (row) => ({
        id: row.id,
        name: row.name,
        cityName: row.cityName,
        price: row.price,
        area: row.area,
        bathrooms: row.bathrooms,
        parkingSpots: row.parkingSpots,
        bedrooms: row.bedrooms,
        longitude: row.longitude,
        latitude: row.latitude,
        images: mediaMap[row.id] || [],
      })
    );

    return {
      projects,
      total: totalRow?.totalEntries || 0,
    };
  }
}
