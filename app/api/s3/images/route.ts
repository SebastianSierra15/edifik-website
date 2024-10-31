import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "@/lib/s3";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File;
    let folderPath = data.get("path") as string;

    if (!file || !folderPath) {
      return NextResponse.json(
        { error: "Faltan el archivo o la ruta del folder" },
        { status: 400 }
      );
    }

    if (!folderPath.endsWith("/")) {
      folderPath += "/";
    }

    const fileBuffer = await file.arrayBuffer();
    const fileKey = `${folderPath}${Date.now()}/${uuidv4()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    });

    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${fileKey}`;

    return NextResponse.json({
      message: "Imagen subida exitosamente",
      url: fileUrl,
    });
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    return NextResponse.json(
      { error: "Error al subir la imagen" },
      { status: 500 }
    );
  }
}
