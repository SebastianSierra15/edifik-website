import { ProjectsMetadata } from "@/src/interfaces";
import { ProjectsMetadataRepository } from "../../domain/ProjectsRepository";

export class GetProjectsMetadata {
  constructor(private readonly repository: ProjectsMetadataRepository) {}

  async execute(): Promise<ProjectsMetadata> {
    return this.repository.getMetadata();
  }
}
