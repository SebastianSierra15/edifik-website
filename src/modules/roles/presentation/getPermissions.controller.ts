import { GetPermissions } from "../application/GetPermissions";
import { MysqlPermissionRepository } from "../infrastructure/MysqlPermissionRepository";

export async function getPermissionsController() {
  const useCase = new GetPermissions(new MysqlPermissionRepository());
  return useCase.execute();
}
