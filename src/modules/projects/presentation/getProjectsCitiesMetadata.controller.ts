import { GetProjectsCitiesMetadata } from "../application/queries/GetProjectsCitiesMetadata";
import { MysqlProjectsCitiesMetadataRepository } from "../infrastructure/MysqlProjectsCitiesMetadataRepository";

export async function getProjectsCitiesMetadataController() {
  const useCase = new GetProjectsCitiesMetadata(
    new MysqlProjectsCitiesMetadataRepository()
  );

  return useCase.execute();
}
