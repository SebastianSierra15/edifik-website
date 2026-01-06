import { BadRequestError } from "@/src/shared";
import { ImageStorageRepository } from "../domain/ImageStorageRepository";

export class DeleteImage {
  constructor(private readonly storage: ImageStorageRepository) {}

  async execute(input: { key?: unknown }) {
    if (!input.key || typeof input.key !== "string") {
      throw new BadRequestError("Clave de archivo inválida");
    }

    await this.storage.delete(input.key);

    return {
      message: "Imagen eliminada correctamente",
    };
  }
}
