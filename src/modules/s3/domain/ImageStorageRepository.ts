export interface ImageStorageRepository {
  upload(params: {
    buffer: Buffer;
    key: string;
    contentType: string;
  }): Promise<{ url: string }>;

  delete(key: string): Promise<void>;
}
