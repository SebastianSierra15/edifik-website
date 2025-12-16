import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectsBasicMetadata } from "@/src/interfaces";
import { ProjectsBasicMetadataRepository } from "../domain/ProjectsRepository";

export class MysqlProjectsBasicMetadataRepository
  implements ProjectsBasicMetadataRepository
{
  async getBasicMetadata(): Promise<ProjectsBasicMetadata> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_basic_metadata()"
    );

    const [
      commonAreasRows = [],
      housingTypesRows = [],
      nearbyServicesRows = [],
      propertyTypesRows = [],
    ] = result;

    return {
      commonAreas: commonAreasRows.map(({ id, name }) => ({ id, name })),
      housingTypes: housingTypesRows.map(({ id, name }) => ({ id, name })),
      nearbyServices: nearbyServicesRows.map(({ id, name }) => ({ id, name })),
      propertyTypes: propertyTypesRows.map(({ id, name }) => ({ id, name })),
    };
  }
}
