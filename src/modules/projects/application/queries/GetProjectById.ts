import { BadRequestError, ForbiddenError } from "@/src/shared";
import { GetProjectByIdRepository } from "../../domain/ProjectsRepository";

export class GetProjectById {
  constructor(private readonly repo: GetProjectByIdRepository) {}

  async execute(input: {
    projectId: number;
    isProject: number;
    isAdmin: number;
    canSeeMembership: boolean;
    ownerId?: number | null;
  }) {
    if (!input.projectId) {
      throw new BadRequestError("ID de proyecto inválido");
    }

    const project = await this.repo.getById(input);

    if (!project) {
      if (input.ownerId && input.isAdmin !== 1) {
        throw new ForbiddenError();
      }

      throw new BadRequestError("Proyecto no encontrado");
    }

    return { project };
  }
}
