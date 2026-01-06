import { db } from "@/lib/db";
import { DeleteRoleRepository } from "../domain/RoleRepository";

export class MysqlDeleteRoleRepository implements DeleteRoleRepository {
  async delete({
    id,
    deletedBy,
  }: {
    id: number;
    deletedBy: number;
  }): Promise<void> {
    await db.query("CALL delete_role(?, ?)", [id, deletedBy]);
  }
}
