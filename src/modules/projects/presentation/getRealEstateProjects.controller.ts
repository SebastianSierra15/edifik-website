import { GetRealEstateProjects } from "../application/queries/GetRealEstateProjects";
import { MysqlRealEstateProjectsRepository } from "../infrastructure/MysqlRealEstateProjectsRepository";

export async function getRealEstateProjectsController(limit: number) {
  const useCase = new GetRealEstateProjects(
    new MysqlRealEstateProjectsRepository()
  );

  return useCase.execute(limit);
}
