import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { projectMedia } = await req.json();

    if (
      !projectMedia ||
      !Array.isArray(projectMedia) ||
      projectMedia.length === 0
    ) {
      return NextResponse.json(
        { error: "El cuerpo de la solicitud no contiene datos válidos." },
        { status: 400 }
      );
    }

    await db.query("CALL insert_multiple_project_media(?)", [
      JSON.stringify(projectMedia),
    ]);

    return NextResponse.json({ message: "Medios insertados correctamente." });
  } catch (error) {
    console.error("❌ Error al insertar los medios:", error);
    return NextResponse.json(
      { error: "Error al insertar los medios." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { projectMedia } = await req.json();

    if (
      !projectMedia ||
      !Array.isArray(projectMedia) ||
      projectMedia.length === 0
    ) {
      return NextResponse.json(
        { error: "El cuerpo de la solicitud no contiene datos válidos." },
        { status: 400 }
      );
    }

    await db.query("CALL update_multiple_project_media(?)", [
      JSON.stringify(projectMedia),
    ]);

    return NextResponse.json({ message: "Medios actualizados correctamente." });
  } catch (error) {
    console.error("❌ Error al actualizar los medios:", error);
    return NextResponse.json(
      { error: "Error al actualizar los medios." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { mediaIds } = await req.json();

    if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
      return NextResponse.json(
        {
          error:
            "El cuerpo de la solicitud no contiene IDs válidos para eliminar.",
        },
        { status: 400 }
      );
    }

    await db.query("CALL delete_multiple_project_media(?)", [
      JSON.stringify(mediaIds),
    ]);

    return NextResponse.json({ message: "Medios eliminados correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar los medios:", error);
    return NextResponse.json(
      { error: "Error al eliminar los medios." },
      { status: 500 }
    );
  }
}
