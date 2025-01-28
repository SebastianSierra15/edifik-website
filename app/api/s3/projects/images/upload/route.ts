import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { s3 } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;
    let folderPath = data.get("path") as string;

    if (!file || !folderPath) {
      console.error("Faltan el archivo o la ruta de la carpeta.");
      return NextResponse.json(
        { error: "Falta la ruta del archivo o carpeta" },
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
      message: "Imagen cargada con éxito y convertida a .webp",
      url: cloudFrontUrl,
    });
  } catch (error) {
    console.error("Error al cargar y convertir la imagen:", error);
    return NextResponse.json(
      { error: "Error al cargar y convertir la imagen." },
      { status: 500 }
    );
  }
}
