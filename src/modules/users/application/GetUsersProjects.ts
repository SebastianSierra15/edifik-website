import {
  UsersProjectsRepository,
  GetUsersProjectsParams,
  GetUsersProjectsResult,
} from "../domain/UserRepository";

export class GetUsersProjects {
  constructor(private readonly repository: UsersProjectsRepository) {}

  async execute(
    params: GetUsersProjectsParams
  ): Promise<GetUsersProjectsResult> {
    if (!params.userId || params.userId <= 0) {
      throw new Error("ID de usuario inválido");
    }

    if (params.page <= 0 || params.pageSize <= 0) {
      throw new Error("Parámetros de paginación inválidos");
    }

    return this.repository.getProjectsByUser(params);
  }
}
