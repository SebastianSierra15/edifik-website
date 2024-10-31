import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const {
      propertyId,
      urlsMatrix,
      typesArray,
    }: {
      propertyId: number;
      urlsMatrix: string[][];
      typesArray: { id: number; category: "imageType" | "commonArea" }[];
    } = await request.json();

    if (!propertyId || !urlsMatrix || !typesArray) {
      return NextResponse.json(
        { error: "Faltan los datos requeridos." },
        { status: 400 }
      );
    }

    if (urlsMatrix.length !== typesArray.length) {
      return NextResponse.json(
        { error: "Las longitudes de las matrices no coinciden." },
        { status: 400 }
      );
    }

    for (let i = 0; i < urlsMatrix.length; i++) {
      const urls = urlsMatrix[i];
      const { id, category } = typesArray[i];

      for (const url of urls) {
        const commonArea = category === "commonArea" ? id : null;
        const imageType = category === "imageType" ? id : null;

        await db.query("CALL insert_property_media(?, ?, ?, ?)", [
          url,
          propertyId,
          commonArea,
          imageType,
        ]);
      }
    }

    return NextResponse.json({ message: "Imagen insertada correctamente." });
  } catch (error) {
    console.error("Error al insertar la imagen:", error);
    return NextResponse.json(
      { error: "Error al insertar la imagen." },
      { status: 500 }
    );
  }
}
