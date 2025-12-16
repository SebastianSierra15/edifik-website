import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectsCitiesMetadata } from "@/src/interfaces";
import { ProjectsCitiesMetadataRepository } from "../domain/ProjectsRepository";

export class MysqlProjectsCitiesMetadataRepository
  implements ProjectsCitiesMetadataRepository
{
  async getCitiesMetadata(): Promise<ProjectsCitiesMetadata> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_cities_departaments()"
    );

    const [departamentsRows = [], citiesRows = []] = result;

    return {
      departaments: departamentsRows.map(
        ({ departamentId, departamentName }) => ({
          id: departamentId,
          name: departamentName,
        })
      ),
      cities: citiesRows.map((row: any) => ({
        id: row.cityId,
        name: row.cityName,
        departament: {
          id: row.departamentId,
          name: row.departamentName,
        },
      })),
    };
  }
}
