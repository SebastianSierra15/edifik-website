import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { projectMedia } = await req.json();

    if (!projectMedia || !Array.isArray(projectMedia)) {
      return NextResponse.json(
        { error: "El cuerpo de la solicitud no contiene datos válidos." },
        { status: 400 },
      );
    }

    for (const media of projectMedia) {
      const { url, tag, description, projectId, commonArea, imageType } = media;

      if (!url || !tag || !projectId) {
        return NextResponse.json(
          { error: "Faltan campos obligatorios en el objeto media." },
          { status: 400 },
        );
      }

      await db.query("CALL insert_project_media(?, ?, ?, ?, ?, ?)", [
        url,
        tag,
        description || null,
        projectId,
        commonArea || null,
        imageType || null,
      ]);
    }

    return NextResponse.json({ message: "Medios insertados correctamente." });
  } catch (error) {
    console.error("Error al insertar los medios:", error);
    return NextResponse.json(
      { error: "Error al insertar los medios." },
      { status: 500 },
    );
  }
}
