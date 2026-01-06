import { ImageType } from "@/src/interfaces";
import { ProjectsImageTypesMetadataRepository } from "../../domain/ProjectsRepository";

export class GetProjectsImageTypesMetadata {
  constructor(
    private readonly repository: ProjectsImageTypesMetadataRepository
  ) {}

  async execute(): Promise<ImageType[]> {
    return this.repository.getImageTypes();
  }
}
