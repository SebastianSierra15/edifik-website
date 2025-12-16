import { BadRequestError } from "@/src/shared";
import { ProjectView } from "@/src/interfaces";
import { CompanyProjectsRepository } from "../../domain/ProjectsRepository";

export class GetCompanyProjects {
  constructor(private readonly repository: CompanyProjectsRepository) {}

  async execute(limit: number): Promise<ProjectView[]> {
    if (!limit || limit <= 0) {
      throw new BadRequestError("Parámetro numberProjects inválido");
    }

    return this.repository.getCompanyProjects(limit);
  }
}
