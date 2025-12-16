import { GetProjectsImageTypesMetadata } from "../application/queries/GetProjectsImageTypesMetadata";
import { MysqlProjectsImageTypesMetadataRepository } from "../infrastructure/MysqlProjectsImageTypesMetadataRepository";

export async function getProjectsImageTypesMetadataController() {
  const useCase = new GetProjectsImageTypesMetadata(
    new MysqlProjectsImageTypesMetadataRepository()
  );

  return useCase.execute();
}
