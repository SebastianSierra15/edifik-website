import { UploadImage } from "../application/UploadImage";
import { S3ImageStorageRepository } from "../infrastructure/S3ImageStorageRepository";
import { SharpImageProcessor } from "../infrastructure/SharpImageProcessor";

export async function uploadImageController(input: {
  file: unknown;
  path: unknown;
}) {
  const useCase = new UploadImage(
    new S3ImageStorageRepository(),
    new SharpImageProcessor()
  );

  return useCase.execute(input);
}
