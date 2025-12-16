import { GetCompanyProjects } from "../application/queries/GetCompanyProjects";
import { MysqlCompanyProjectsRepository } from "../infrastructure/MysqlCompanyProjectsRepository";

export async function getCompanyProjectsController(limit: number) {
  const useCase = new GetCompanyProjects(new MysqlCompanyProjectsRepository());

  return useCase.execute(limit);
}
