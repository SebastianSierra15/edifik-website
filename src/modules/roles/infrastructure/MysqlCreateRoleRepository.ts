import { db } from "@/lib/db";
import { CreateRoleRepository } from "../domain/RoleRepository";

export class MysqlCreateRoleRepository implements CreateRoleRepository {
  async create({
    name,
    permissions,
    createdBy,
  }: {
    name: string;
    permissions: number[];
    createdBy: number;
  }): Promise<void> {
    const permissionsPayload = permissions.map((id) => ({ id }));

    await db.query("CALL create_role(?, ?, ?)", [
      name,
      JSON.stringify(permissionsPayload),
      createdBy,
    ]);
  }
}
