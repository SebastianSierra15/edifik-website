import sharp from "sharp";
import { ImageProcessor } from "../domain/ImageProcessor";

export class SharpImageProcessor implements ImageProcessor {
  async convertToWebp(input: Buffer): Promise<Buffer> {
    return sharp(input).webp({ quality: 80 }).toBuffer();
  }
}
