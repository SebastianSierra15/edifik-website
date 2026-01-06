import { GetUsersProjects } from "../application/GetUsersProjects";
import { MysqlUsersProjectsRepository } from "../infrastructure/MysqlUsersProjectsRepository";

export async function getUsersProjectsController(params: {
  userId: number;
  page: number;
  pageSize: number;
}) {
  const useCase = new GetUsersProjects(new MysqlUsersProjectsRepository());

  return useCase.execute(params);
}
