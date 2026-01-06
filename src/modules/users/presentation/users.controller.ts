import { MysqlUserRepository } from "../infrastructure/MysqlUserRepository";
import { GetUsersUseCase } from "../application/GetUser";

interface GetUsersControllerParams {
  page: number;
  pageSize: number;
  searchTerm: string | null;
}

export async function getUsersController(params: GetUsersControllerParams) {
  const repository = new MysqlUserRepository();
  const useCase = new GetUsersUseCase(repository);

  return useCase.execute(params);
}
