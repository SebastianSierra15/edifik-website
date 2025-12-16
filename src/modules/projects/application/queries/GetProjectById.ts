import { BadRequestError } from "@/src/shared";
import { GetProjectByIdRepository } from "../../domain/ProjectsRepository";

export class GetProjectById {
  constructor(private readonly repo: GetProjectByIdRepository) {}

  async execute(input: {
    projectId: number;
    isProject: number;
    isAdmin: number;
    canSeeMembership: boolean;
  }) {
    if (!input.projectId) {
      throw new BadRequestError("ID de proyecto inválido");
    }

    const project = await this.repo.getById(input);

    if (!project) {
      throw new BadRequestError("Proyecto no encontrado");
    }

    return { project };
  }
}
