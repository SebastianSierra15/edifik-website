import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Permission } from "@/src/interfaces";
import { escapeSearchTerm } from "@/utils";
import { GetRolesRepository } from "../domain/RoleRepository";

export class MysqlGetRolesRepository implements GetRolesRepository {
  async getAll({
    page,
    pageSize,
    searchTerm,
  }: {
    page: number;
    pageSize: number;
    searchTerm?: string | null;
  }) {
    const safeSearchTerm = escapeSearchTerm(searchTerm ?? null);

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_roles_with_permissions(?, ?, ?)",
      [page, pageSize, safeSearchTerm]
    );

    const [rolesRows = [], [totalRow] = [], permissionRows = []] = result;

    const permissionsByRole: Record<number, Permission[]> = {};

    for (const row of permissionRows as any[]) {
      permissionsByRole[row.id_role] ||= [];
      permissionsByRole[row.id_role].push({
        id: row.id_permission,
        name: row.name_permission,
      });
    }

    const roles = (rolesRows as any[]).map(({ id, name }) => ({
      id,
      name,
      permissions: permissionsByRole[id] || [],
    }));

    return {
      roles,
      total: totalRow?.totalEntries || 0,
    };
  }
}
