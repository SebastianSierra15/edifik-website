import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { s3 } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    const { key } = await req.json();

    if (!key) {
      console.error("❌ No se proporcionó la clave del archivo.");
      return NextResponse.json(
        { error: "Falta la clave del archivo" },
        { status: 400 }
      );
    }

    console.log(`🔴 Intentando eliminar: ${key}`);

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);

    console.log(`✅ Imagen eliminada: ${key}`);

    return NextResponse.json({
      message: "Imagen eliminada correctamente de S3",
      deletedKey: key,
    });
  } catch (error) {
    console.error("🚨 Error al borrar la imagen de S3:", error);
    return NextResponse.json(
      { error: "Error al borrar la imagen de S3." },
      { status: 500 }
    );
  }
}
