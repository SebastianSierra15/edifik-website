import { BadRequestError } from "@/src/shared";
import { ProjectView } from "@/src/interfaces";
import { RealEstateProjectsRepository } from "../../domain/ProjectsRepository";

export class GetRealEstateProjects {
  constructor(private readonly repository: RealEstateProjectsRepository) {}

  async execute(limit: number): Promise<ProjectView[]> {
    if (!limit || limit <= 0) {
      throw new BadRequestError("Parámetro numberProjects inválido");
    }

    return this.repository.getRealEstateProjects(limit);
  }
}
