import { ProjectsBasicMetadata } from "@/src/interfaces";
import { ProjectsBasicMetadataRepository } from "../../domain/ProjectsRepository";

export class GetProjectsBasicMetadata {
  constructor(private readonly repository: ProjectsBasicMetadataRepository) {}

  async execute(): Promise<ProjectsBasicMetadata> {
    return this.repository.getBasicMetadata();
  }
}
