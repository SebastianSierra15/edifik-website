import { db } from "@/lib/db";
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
    permissions: number[];
    updatedBy: number;
  }): Promise<void> {
    const permissionsPayload = permissions.map((id) => ({ id }));

    await db.query("CALL update_role(?, ?, ?, ?)", [
      id,
      name,
      JSON.stringify(permissionsPayload),
      updatedBy,
    ]);
  }
}
