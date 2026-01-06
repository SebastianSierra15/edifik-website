import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Permission } from "@/src/interfaces";
import { PermissionRepository } from "../domain/RoleRepository";

export class MysqlPermissionRepository implements PermissionRepository {
  async getAll(): Promise<Permission[]> {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_permissions()"
    );

    const [rows = []] = result;

    return (rows as RowDataPacket[]).map(({ id, name }) => ({ id, name }));
  }
}
