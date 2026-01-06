export interface ImageProcessor {
  convertToWebp(input: Buffer): Promise<Buffer>;
}
