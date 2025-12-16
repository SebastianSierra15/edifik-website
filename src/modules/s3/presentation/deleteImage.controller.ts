import { DeleteImage } from "../application/DeleteImage";
import { S3ImageStorageRepository } from "../infrastructure/S3ImageStorageRepository";

export async function deleteImageController(input: { key?: unknown }) {
  const useCase = new DeleteImage(new S3ImageStorageRepository());
  return useCase.execute(input);
}
