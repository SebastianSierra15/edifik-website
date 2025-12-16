import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectsMetadata } from "@/src/interfaces";
import { ProjectsMetadataRepository } from "../domain/ProjectsRepository";

export class MysqlProjectsMetadataRepository
  implements ProjectsMetadataRepository
{
  async getMetadata(): Promise<ProjectsMetadata> {
    const [result] = await db.query<RowDataPacket[][]>("CALL get_metadata()");

    const [
      citiesRows = [],
      commonAreasRows = [],
      housingTypesRows = [],
      nearbyServicesRows = [],
      propertyTypesRows = [],
      membershipsRows = [],
    ] = result;

    return {
      cities: citiesRows.map((row: any) => ({
        id: row.cityId,
        name: row.cityName,
        departament: {
          id: row.departamentId,
          name: row.departamentName,
        },
      })),
      commonAreas: commonAreasRows.map(({ id, name }) => ({ id, name })),
      housingTypes: housingTypesRows.map(({ id, name }) => ({ id, name })),
      nearbyServices: nearbyServicesRows.map(({ id, name }) => ({ id, name })),
      propertyTypes: propertyTypesRows.map(({ id, name }) => ({ id, name })),
      memberships: membershipsRows.map(({ membershipId, membershipName }) => ({
        id: membershipId,
        name: membershipName,
      })),
    };
  }
}
