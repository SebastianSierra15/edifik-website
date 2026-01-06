import { GetUsersMetadata } from "../application/GetUsersMetadata";
import { MysqlUserMetadataRepository } from "../infrastructure/MysqlUserMetadataRepository";

export async function getUsersMetadataController() {
  const useCase = new GetUsersMetadata(new MysqlUserMetadataRepository());
  return useCase.execute();
}
