import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ProjectOwner } from "@/src/interfaces";
import { GetProjectOwnerByEmailRepository } from "../domain/ProjectOwnerRepository";

export class MysqlGetProjectOwnerRepository
  implements GetProjectOwnerByEmailRepository
{
  async findByEmail(email: string): Promise<ProjectOwner | null> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_user_owner(?)",
      [email]
    );

    const row = result?.[0]?.[0];

    if (!row) return null;

    return {
      id: row.id,
      names: row.names,
      lastnames: row.lastnames,
      email: row.email,
      phoneNumber: row.phoneNumber ?? null,
    };
  }
}
