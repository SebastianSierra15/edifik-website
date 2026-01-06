import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../shared";
import { ImageStorageRepository } from "../domain/ImageStorageRepository";

export class S3ImageStorageRepository implements ImageStorageRepository {
  async upload(params: {
    buffer: Buffer;
    key: string;
    contentType: string;
  }): Promise<{ url: string }> {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: params.key,
      Body: params.buffer,
      ContentType: params.contentType,
    });

    await s3Client.send(command);

    return {
      url: `https://${process.env.CLOUDFRONT_DOMAIN}/${params.key}`,
    };
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  }
}
