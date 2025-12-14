import {
  GetUserProjectsParams,
  GetUserProjectsResult,
  UserProjectsRepository,
} from "../domain/UserProjectsRepository";

export class GetUserProjects {
  constructor(private readonly repository: UserProjectsRepository) {}

  async execute(params: GetUserProjectsParams): Promise<GetUserProjectsResult> {
    if (!Number.isInteger(params.userId) || params.userId <= 0) {
      throw new Error("Usuario inválido");
    }
    if (!Number.isInteger(params.page) || params.page < 1) {
      throw new Error("Page inválida");
    }
    if (!Number.isInteger(params.pageSize) || params.pageSize < 1) {
      throw new Error("PageSize inválido");
    }
    if (!Number.isInteger(params.statusProject) || params.statusProject < 0) {
      throw new Error("statusProject inválido");
    }

    return this.repository.getUserProjects(params);
  }
}
