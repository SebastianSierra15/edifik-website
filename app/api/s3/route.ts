import { NextResponse } from "next/server";
import { s3 } from "@/lib/s3";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sharp from "sharp";

export async function POST(req: Request) {
  const startTime = performance.now(); // Inicia medición del tiempo total de la API

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar usuarios"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

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

    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Formato de archivo no permitido. Solo imágenes (JPG, PNG, WEBP).",
        },
        { status: 400 }
      );
    }

    const originalBuffer = await file.arrayBuffer();

    const conversionStartTime = performance.now(); // Inicia medición del tiempo de conversión de la imagen

    const webpBuffer = await sharp(Buffer.from(originalBuffer))
      .webp({ quality: 80 })
      .toBuffer();

    const conversionEndTime = performance.now(); // Finaliza medición de la conversión de la imagen

    const fileKey = `${folderPath}${Date.now()}/${uuidv4()}.webp`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: webpBuffer,
      ContentType: "image/webp",
    });

    const uploadStartTime = performance.now(); // Inicia medición del tiempo de subida a S3

    await s3.send(command);

    const uploadEndTime = performance.now(); // Finaliza medición de la subida a S3

    const cloudFrontUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${fileKey}`;

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const conversionDuration = conversionEndTime - conversionStartTime;
    const uploadDuration = uploadEndTime - uploadStartTime;

    const response = NextResponse.json({
      message: "Imagen cargada con éxito y convertida a .webp",
      url: cloudFrontUrl,
    });
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, image-conversion;dur=${conversionDuration.toFixed(2)}, s3-upload;dur=${uploadDuration.toFixed(2)}`
    );

    return response;
  } catch (error) {
    console.error("Error al cargar y convertir la imagen:", error);
    return NextResponse.json(
      { error: "Error al cargar y convertir la imagen." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const startTime = performance.now(); // Inicia medición del tiempo total de la API

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar usuarios"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json(
        { error: "Falta la clave del archivo o es inválida." },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const deleteStartTime = performance.now(); // Inicia medición del tiempo de eliminación en S3

    await s3.send(command);

    const deleteEndTime = performance.now(); // Finaliza medición del tiempo de eliminación en S3

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const deleteDuration = deleteEndTime - deleteStartTime;

    const response = NextResponse.json({
      message: "Imagen eliminada correctamente de S3",
      deletedKey: key,
    });
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, s3-delete;dur=${deleteDuration.toFixed(2)}`
    );

    return response;
  } catch (error) {
    console.error("🚨 Error al borrar la imagen de S3:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la imagen. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
