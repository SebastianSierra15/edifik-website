import { BadRequestError } from "@/src/shared";
import { DeleteProjectStateRepository } from "../../domain/ProjectsRepository";
import { DeleteProjectPolicy } from "../../domain/ProjectPolicy";

export class DeleteProjectState {
  constructor(private readonly repo: DeleteProjectStateRepository) {}

  async execute(projectId: number, policy: DeleteProjectPolicy): Promise<void> {
    if (!projectId) {
      throw new BadRequestError("ID de proyecto no válido");
    }

    await this.repo.deleteState(projectId, policy.userId);
  }
}
