import { db } from "@/lib/db";
import { Permission } from "@/src/interfaces";
import { UpdateRoleRepository } from "../domain/RoleRepository";

export class MysqlUpdateRoleRepository implements UpdateRoleRepository {
  async update({
    id,
    name,
    permissions,
    updatedBy,
  }: {
    id: number;
    name: string;
    permissions: Permission[];
    updatedBy: number;
  }): Promise<void> {
    await db.query("CALL update_role(?, ?, ?, ?)", [
      id,
      name,
      JSON.stringify(permissions),
      updatedBy,
    ]);
  }
}
