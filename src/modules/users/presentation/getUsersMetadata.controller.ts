import { GetUsersMetadata } from "../application/GetUsersMetadata";
import { MysqlUserMetadataRepository } from "../infrastructure/MysqlUserMetadataRepository";
import { requirePermission } from "@/src/modules/auth/application/requirePermission";
import { Permission } from "@/src/modules/auth/domain/Permission";

export async function getUsersMetadataController() {
  await requirePermission(Permission.ManageUsers);

  const useCase = new GetUsersMetadata(new MysqlUserMetadataRepository());

  return useCase.execute();
}
