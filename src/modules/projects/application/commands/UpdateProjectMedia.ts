import { BadRequestError } from "@/src/shared";
import { UpdateProjectMediaRepository } from "../../domain/ProjectsRepository";
import { ProjectMediaInput } from "../../domain/ProjectMediaInput";

export class UpdateProjectMedia {
  constructor(private readonly repo: UpdateProjectMediaRepository) {}

  async execute(media: ProjectMediaInput[]): Promise<void> {
    if (!media || !Array.isArray(media) || media.length === 0) {
      throw new BadRequestError("No se proporcionaron medios válidos");
    }

    await this.repo.updateMany(media);
  }
}
