import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectDetails } from "@/src/interfaces";
import { GetProjectByIdRepository } from "../domain/ProjectsRepository";

export class MysqlGetProjectByIdRepo implements GetProjectByIdRepository {
  async getById({
    projectId,
    isProject,
    isAdmin,
    canSeeMembership,
  }: any): Promise<ProjectDetails | null> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_project_by_id(?, ?, ?)",
      [projectId, isProject, isAdmin]
    );

    const [
      projectsRows = [],
      nearbyServicesRows = [],
      commonAreasRows = [],
      projectMediaRows = [],
    ] = result;

    if (!projectsRows.length) return null;

    const row = projectsRows[0] as any;

    return {
      id: row.id,
      name: row.name,
      state: row.state,
      price: row.price,
      totalArea: row.totalArea,
      builtArea: row.builtArea,
      freeHeight: row.freeHeight,
      width: row.width,
      length: row.length,
      parkingSpots: row.parkingSpots,
      elevator: row.elevator,
      heavyParking: row.heavyParking,
      availableUnits: row.availableUnits,
      bathrooms: row.bathrooms,
      bedrooms: row.bedrooms,
      lobbies: row.lobbies,
      towers: row.towers,
      storageUnits: row.storageUnits,
      socioeconomicLevel: row.socioeconomicLevel,
      floorNumber: row.floorNumber,
      yearBuilt: row.yearBuilt,
      customizationOptions: row.customizationOptions,
      terrace: row.terrace,
      balcony: row.balcony,
      garden: row.garden,
      laundryArea: row.laundryArea,
      complexName: row.complexName,
      shortDescription: row.shortDescription,
      detailedDescription: row.detailedDescription,
      address: row.address,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      availableDate: row.availableDate
        ? new Date(row.availableDate)
        : undefined,

      propertyType: {
        id: row.propertyTypeId,
        name: row.propertyTypeName,
      },
      projectType: {
        id: row.projectTypeId,
        name: row.projectTypeName,
      },
      housingType: {
        id: row.housingTypeId,
        name: row.housingTypeName,
      },
      city: {
        id: row.cityId,
        name: row.cityName,
        departament: {
          id: row.departamentId,
          name: row.departamentName,
        },
      },

      membership: canSeeMembership ? row.membership : "Membresía Privada",

      statusProject: {
        id: row.statusProjectId,
        name: row.statusProjectName,
      },

      ownerId: row.ownerId,
      email: row.email,
      phoneNumber: row.phoneNumber,

      residentialProjectId: row.residentialProjectId,
      warehouseProjectId: row.warehouseProjectId,

      commonAreas: commonAreasRows.map((r: any) => ({
        id: r.id,
        name: r.name,
      })),
      nearbyServices: nearbyServicesRows.map((r: any) => ({
        id: r.id,
        name: r.name,
      })),
      projectMedia: projectMediaRows.map((r: any) => ({
        id: r.id,
        url: r.url,
        tag: r.tag,
        projectId: row.id,
      })),
    };
  }
}
