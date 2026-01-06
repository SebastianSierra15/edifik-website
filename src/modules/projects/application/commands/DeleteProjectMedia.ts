import { BadRequestError } from "@/src/shared";
import { DeleteProjectMediaRepository } from "../../domain/ProjectsRepository";

export class DeleteProjectMedia {
  constructor(private readonly repo: DeleteProjectMediaRepository) {}

  async execute(mediaIds: number[]): Promise<void> {
    if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
      throw new BadRequestError("No se proporcionaron IDs válidos");
    }

    await this.repo.deleteMany(mediaIds);
  }
}
