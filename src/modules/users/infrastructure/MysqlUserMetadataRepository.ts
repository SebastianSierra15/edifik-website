import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { UserMetadataRepository } from "../domain/UserRepository";
import { UsersMetadata } from "../domain/User";

export class MysqlUserMetadataRepository implements UserMetadataRepository {
  async getMetadata(): Promise<UsersMetadata> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_users_metadata()"
    );

    const [rolesRows = [], gendersRows = [], membershipsRows = []] = result;

    return {
      roles: rolesRows.map(({ id, name }) => ({ id, name })),
      genders: gendersRows.map(({ id, name }) => ({ id, name })),
      memberships: membershipsRows.map(({ id, name }) => ({ id, name })),
    };
  }
}
