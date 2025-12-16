import { UpdateRole } from "../application/UpdateRole";
import { MysqlUpdateRoleRepository } from "../infrastructure/MysqlUpdateRoleRepository";

export async function updateRoleController(input: any) {
  return new UpdateRole(new MysqlUpdateRoleRepository()).execute(input);
}
