import { BadRequestError } from "@/src/shared";
import { DeleteProjectPermanentlyRepository } from "../../domain/ProjectsRepository";
import { DeleteProjectPolicy } from "../../domain/ProjectPolicy";

export class DeleteProjectPermanently {
  constructor(private readonly repo: DeleteProjectPermanentlyRepository) {}

  async execute(projectId: number, policy: DeleteProjectPolicy): Promise<void> {
    if (!projectId) {
      throw new BadRequestError("ID de proyecto no válido");
    }

    await this.repo.deletePermanently(projectId, policy.userId);
  }
}
