import { CreateRole } from "../application/CreateRole";
import { MysqlCreateRoleRepository } from "../infrastructure/MysqlCreateRoleRepository";
export async function createRoleController(input: {
  name: string;
  permissions: number[];
  userId: number;
}) {
  return new CreateRole(new MysqlCreateRoleRepository()).execute(input);
}
