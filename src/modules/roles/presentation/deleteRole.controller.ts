import { DeleteRole } from "../application/DeleteRole";
import { MysqlDeleteRoleRepository } from "../infrastructure/MysqlDeleteRoleRepository";

export async function deleteRoleController(input: {
  id: number;
  userId: number;
}) {
  return new DeleteRole(new MysqlDeleteRoleRepository()).execute(input);
}
