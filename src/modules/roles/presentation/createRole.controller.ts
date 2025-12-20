import { CreateRole } from "../application/CreateRole";
import { MysqlCreateRoleRepository } from "../infrastructure/MysqlCreateRoleRepository";
import { Permission } from "@/src/interfaces";

export async function createRoleController(input: {
  name: string;
  permissions: Permission[];
  userId: number;
}) {
  return new CreateRole(new MysqlCreateRoleRepository()).execute(input);
}
