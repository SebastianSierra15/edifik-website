import { BadRequestError } from "@/src/shared";
import { CreateProjectMediaRepository } from "../../domain/ProjectsRepository";
import { ProjectMediaInput } from "../../domain/ProjectMediaInput";

export class CreateProjectMedia {
  constructor(private readonly repo: CreateProjectMediaRepository) {}

  async execute(media: ProjectMediaInput[]): Promise<void> {
    if (!media || !Array.isArray(media) || media.length === 0) {
      throw new BadRequestError("No se proporcionaron medios válidos");
    }

    await this.repo.createMany(media);
  }
}
