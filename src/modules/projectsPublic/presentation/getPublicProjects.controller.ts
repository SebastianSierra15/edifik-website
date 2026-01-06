import { GetPublicProjects } from "../application/GetPublicProjects";
import { MysqlGetPublicProjectsRepository } from "../infrastructure/MysqlGetPublicProjectsRepository";

export async function getPublicProjectsController() {
  const useCase = new GetPublicProjects(new MysqlGetPublicProjectsRepository());

  return useCase.execute();
}
