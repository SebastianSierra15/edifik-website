import { BadRequestError } from "@/src/shared";
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
      throw new BadRequestError("ID de usuario inválido");
    }

    if (params.page <= 0) {
      throw new BadRequestError("Parámetro page inválido");
    }

    if (params.pageSize <= 0) {
      throw new BadRequestError("Parámetro pageSize inválido");
    }

    return this.repository.getProjectsByUser(params);
  }
}
