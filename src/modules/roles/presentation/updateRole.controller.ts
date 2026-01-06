import { UpdateRole } from "../application/UpdateRole";
import { MysqlUpdateRoleRepository } from "../infrastructure/MysqlUpdateRoleRepository";
interface UpdateRoleControllerInput {
  id: number;
  name: string;
  permissions: number[];
  userId: number;
}

export async function updateRoleController(input: UpdateRoleControllerInput) {
  return new UpdateRole(new MysqlUpdateRoleRepository()).execute(input);
}
