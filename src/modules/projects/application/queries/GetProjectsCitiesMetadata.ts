import { ProjectsCitiesMetadata } from "@/src/interfaces";
import { ProjectsCitiesMetadataRepository } from "../../domain/ProjectsRepository";

export class GetProjectsCitiesMetadata {
  constructor(private readonly repository: ProjectsCitiesMetadataRepository) {}

  async execute(): Promise<ProjectsCitiesMetadata> {
    return this.repository.getCitiesMetadata();
  }
}
