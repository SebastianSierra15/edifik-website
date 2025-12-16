import {
  GetUserProjectsParams,
  GetUserProjectsResult,
  UserProjectsRepository,
} from "../domain/UserProjectsRepository";

export class GetUserProjects {
  constructor(private readonly repository: UserProjectsRepository) {}

  async execute(params: GetUserProjectsParams): Promise<GetUserProjectsResult> {
    return this.repository.getUserProjects(params);
  }
}
