import { db } from "@/lib/db";
import { formatDateForMySQL } from "@/utils";
import { UpdateProjectRepository } from "../domain/ProjectsRepository";
import { ProjectUpdateInput } from "../domain/ProjectUpdateInput";

export class MysqlUpdateProjectRepository implements UpdateProjectRepository {
  async updateProject(
    input: ProjectUpdateInput & {
      state: string;
      ownerId: number | null;
    }
  ): Promise<void> {
    const toJson = (arr?: number[] | null) =>
      arr ? JSON.stringify(arr) : null;

    const params = [
      input.id,
      input.name,
      input.state,
      input.price ?? null,
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
      input.videoUrl ?? null,
      input.cityId,
      input.housingTypeId ?? null,
      input.membershipId ?? 1001,
      input.propertyTypeId,
      input.projectTypeId,
      input.statusProjectId ?? 1,
      input.residentialProjectId ?? null,
      input.warehouseProjectId ?? null,
      toJson(input.commonAreaIds),
      toJson(input.nearbyServiceIds),
      input.ownerId,
    ];

    await db.query(
      "CALL update_project(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      params
    );
  }
}
