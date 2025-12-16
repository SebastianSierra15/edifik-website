import { GetRoles } from "../application/GetRoles";
import { MysqlGetRolesRepository } from "../infrastructure/MysqlGetRolesRepository";

export async function getRolesController(params: {
  page: number;
  pageSize: number;
  searchTerm?: string | null;
}) {
  return new GetRoles(new MysqlGetRolesRepository()).execute(params);
}
