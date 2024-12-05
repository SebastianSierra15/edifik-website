import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { s3 } from "@/lib/s3";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File;
    let folderPath = data.get("path") as string;

    if (!file || !folderPath) {
      console.error("Faltan el archivo o la ruta de la carpeta.");
      return NextResponse.json(
        { error: "File or folder path is missing" },
        { status: 400 }
      );
    }

    if (!folderPath.endsWith("/")) {
      folderPath += "/";
    }

    const originalBuffer = await file.arrayBuffer();

    const webpBuffer = await sharp(Buffer.from(originalBuffer))
      .webp({ quality: 100 })
      .toBuffer();

    const fileKey = `${folderPath}${Date.now()}/${uuidv4()}.webp`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: webpBuffer,
      ContentType: "image/webp",
    });

    await s3.send(command);

    const cloudFrontUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${fileKey}`;

    return NextResponse.json({
      message: "Image successfully uploaded and converted to .webp",
      url: cloudFrontUrl,
    });
  } catch (error) {
    console.error("Error uploading and converting image:", error);
    return NextResponse.json(
      { error: "Error uploading and converting image." },
      { status: 500 }
    );
  }
}
