import { GetProjectsBasicMetadata } from "../application/queries/GetProjectsBasicMetadata";
import { MysqlProjectsBasicMetadataRepository } from "../infrastructure/MysqlProjectsBasicMetadataRepository";

export async function getProjectsBasicMetadataController() {
  const useCase = new GetProjectsBasicMetadata(
    new MysqlProjectsBasicMetadataRepository()
  );

  return useCase.execute();
}
