import { UserProjectsRepository } from "../domain/UserProjectsRepository";

export class DeleteUserProject {
  constructor(private readonly repository: UserProjectsRepository) {}

  async execute(input: { projectId: number; userId: number }): Promise<void> {
    if (!Number.isInteger(input.userId) || input.userId <= 0) {
      throw new Error("Usuario inválido");
    }
    if (!Number.isInteger(input.projectId) || input.projectId <= 0) {
      throw new Error("projectId inválido");
    }

    await this.repository.deleteUserProject(input);
  }
}
