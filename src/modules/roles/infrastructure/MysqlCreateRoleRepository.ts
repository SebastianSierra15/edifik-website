import { db } from "@/lib/db";
import { Permission } from "@/src/interfaces";
import { CreateRoleRepository } from "../domain/RoleRepository";

export class MysqlCreateRoleRepository implements CreateRoleRepository {
  async create({
    name,
    permissions,
    createdBy,
  }: {
    name: string;
    permissions: Permission[];
    createdBy: number;
  }): Promise<void> {
    await db.query("CALL create_role(?, ?, ?)", [
      name,
      JSON.stringify(permissions),
      createdBy,
    ]);
  }
}
