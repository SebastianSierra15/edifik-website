import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectsImageTypesMetadataRepository } from "../domain/ProjectsRepository";
import { ImageType } from "@/src/interfaces";

export class MysqlProjectsImageTypesMetadataRepository
  implements ProjectsImageTypesMetadataRepository
{
  async getImageTypes(): Promise<ImageType[]> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_image_types()"
    );

    const rows = result[0] ?? [];

    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description ?? null,
      maxImagesAllowed: row.maxImagesAllowed,
      isRequired: Boolean(row.isRequired),
    }));
  }
}
