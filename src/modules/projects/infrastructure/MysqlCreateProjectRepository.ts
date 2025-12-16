import { db } from "@/lib/db";
import { formatDateForMySQL } from "@/utils/formatDateForMySQL";
import { CreateProjectRepository } from "../domain/ProjectsRepository";
import { ProjectCreateInput } from "../domain/ProjectCreateInput";

export class MysqlCreateProjectRepository implements CreateProjectRepository {
  async createProject(
    input: ProjectCreateInput & { state: string; ownerId: number | null }
  ): Promise<number> {
    const toJson = (arr?: number[] | null) =>
      arr ? JSON.stringify(arr) : null;

    const params = [
      input.name,
      input.state,
      input.price,
      input.builtArea,
      input.totalArea,
      input.freeHeight ?? null,
      input.width ?? null,
      input.length ?? null,
      input.parkingSpots ?? 0,
      input.elevator ? 1 : 0,
      input.availableUnits ?? 0,
      input.heavyParking ?? null,
      input.bedrooms ?? null,
      input.bathrooms ?? 0,
      input.lobbies ?? 0,
      input.towers ?? null,
      input.storageUnits ?? null,
      input.socioeconomicLevel ?? null,
      input.floorNumber ?? null,
      input.yearBuilt ?? null,
      input.customizationOptions ?? false,
      input.balcony ?? false,
      input.terrace ?? null,
      input.garden ?? null,
      input.laundryArea ?? false,
      input.complexName ?? null,
      input.shortDescription,
      input.detailedDescription,
      input.address,
      input.latitude,
      input.longitude,
      formatDateForMySQL(input.availableDate),
      input.cityId,
      input.housingTypeId ?? null,
      input.membershipId ?? 1001,
      input.propertyTypeId,
      input.projectTypeId,
      input.statusProjectId ?? 1,
      toJson(input.commonAreaIds),
      toJson(input.nearbyServiceIds),
      input.ownerId,
    ];

    const [result] = await db.query(
      "CALL create_project(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      params
    );

    return (result as any[][])[0][0]?.projectId;
  }
}
