import { BadRequestError } from "@/src/shared";
import { ImageStorageRepository } from "../domain/ImageStorageRepository";
import { ImageProcessor } from "../domain/ImageProcessor";
import { v4 as uuidv4 } from "uuid";

interface UploadImageInput {
  file: unknown;
  path: unknown;
}

export class UploadImage {
  constructor(
    private readonly storage: ImageStorageRepository,
    private readonly processor: ImageProcessor
  ) {}

  async execute(input: UploadImageInput) {
    const { file, path } = input;

    if (!(file instanceof File)) {
      throw new BadRequestError("Archivo inválido");
    }

    if (!path || typeof path !== "string") {
      throw new BadRequestError("Ruta inválida");
    }

    if (!path.endsWith("/")) {
      throw new BadRequestError("La ruta debe terminar en '/'");
    }

    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(file.type)) {
      throw new BadRequestError("Formato no permitido. Solo JPG, PNG o WEBP");
    }

    const originalBuffer = Buffer.from(await file.arrayBuffer());
    const webpBuffer = await this.processor.convertToWebp(originalBuffer);

    const key = `${path}${Date.now()}/${uuidv4()}.webp`;

    return this.storage.upload({
      buffer: webpBuffer,
      key,
      contentType: "image/webp",
    });
  }
}
