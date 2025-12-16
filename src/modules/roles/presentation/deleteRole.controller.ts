import { DeleteRole } from "../application/DeleteRole";
import { MysqlDeleteRoleRepository } from "../infrastructure/MysqlDeleteRoleRepository";

export async function deleteRoleController(input: any) {
  return new DeleteRole(new MysqlDeleteRoleRepository()).execute(input);
}
