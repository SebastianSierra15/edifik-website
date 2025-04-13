import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) =>
      perm.name === "Gestionar proyectos" ||
      perm.name === "Gestionar propiedades" ||
      perm.name === "Gestionar propiedades propias"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

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

    const response = NextResponse.json({
      message: "Medios insertados correctamente.",
    });

    return response;
  } catch (error) {
    console.error("❌ Error al insertar los medios:", error);
    return NextResponse.json(
      { error: "Error al insertar los medios." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) =>
      perm.name === "Gestionar proyectos" ||
      perm.name === "Gestionar propiedades" ||
      perm.name === "Gestionar propiedades propias"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

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

    const response = NextResponse.json({
      message: "Medios actualizados correctamente.",
    });

    return response;
  } catch (error) {
    console.error("❌ Error al actualizar los medios:", error);
    return NextResponse.json(
      { error: "Error al actualizar los medios." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) =>
      perm.name === "Gestionar proyectos" ||
      perm.name === "Gestionar propiedades" ||
      perm.name === "Gestionar propiedades propias"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

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

    const response = NextResponse.json({
      message: "Medios eliminados correctamente.",
    });

    return response;
  } catch (error) {
    console.error("❌ Error al eliminar los medios:", error);
    return NextResponse.json(
      { error: "Error al eliminar los medios." },
      { status: 500 }
    );
  }
}
