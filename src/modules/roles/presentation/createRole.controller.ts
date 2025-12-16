import { CreateRole } from "../application/CreateRole";
import { MysqlCreateRoleRepository } from "../infrastructure/MysqlCreateRoleRepository";

export async function createRoleController(input: any) {
  return new CreateRole(new MysqlCreateRoleRepository()).execute(input);
}
