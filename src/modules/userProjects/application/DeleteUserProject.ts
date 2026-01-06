import { UserProjectsRepository } from "../domain/UserProjectsRepository";

export class DeleteUserProject {
  constructor(private readonly repository: UserProjectsRepository) {}

  async execute(input: { projectId: number; userId: number }): Promise<void> {
    await this.repository.deleteUserProject(input);
  }
}
