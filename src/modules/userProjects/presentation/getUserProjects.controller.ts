import { GetUserProjects } from "../application/GetUserProjects";
import { MysqlUserProjectsRepository } from "../infrastructure/MysqlUserProjectsRepository";

export async function getUserProjectsController(params: {
  userId: number;
  page: number;
  pageSize: number;
  statusProject: number;
}) {
  const useCase = new GetUserProjects(new MysqlUserProjectsRepository());
  return useCase.execute(params);
}
