import { GetProjectsMetadata } from "../application/queries/GetProjectsMetadata";
import { MysqlProjectsMetadataRepository } from "../infrastructure/MysqlProjectsMetadataRepository";

export async function getProjectsMetadataController() {
  const useCase = new GetProjectsMetadata(
    new MysqlProjectsMetadataRepository()
  );

  return useCase.execute();
}
