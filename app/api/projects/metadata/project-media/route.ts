import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const startTime = performance.now(); // Inicia medición del tiempo total de la API

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) =>
      perm.name === "Gestionar proyectos" ||
      perm.name === "Gestionar propiedades"
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

    const dbStartTime = performance.now(); // Inicia medición del tiempo de consulta a la BD

    await db.query("CALL insert_multiple_project_media(?)", [
      JSON.stringify(projectMedia),
    ]);

    const dbEndTime = performance.now(); // Finaliza medición de la BD

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const dbDuration = dbEndTime - dbStartTime;

    const response = NextResponse.json({
      message: "Medios insertados correctamente.",
    });
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, db-query;dur=${dbDuration.toFixed(2)}`
    );

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
  const startTime = performance.now(); // Inicia medición del tiempo total de la API

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) =>
      perm.name === "Gestionar proyectos" ||
      perm.name === "Gestionar propiedades"
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

    const dbStartTime = performance.now(); // Inicia medición del tiempo de consulta a la BD

    await db.query("CALL update_multiple_project_media(?)", [
      JSON.stringify(projectMedia),
    ]);

    const dbEndTime = performance.now(); // Finaliza medición de la BD

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const dbDuration = dbEndTime - dbStartTime;

    const response = NextResponse.json({
      message: "Medios actualizados correctamente.",
    });
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, db-query;dur=${dbDuration.toFixed(2)}`
    );

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
  const startTime = performance.now(); // Inicia medición del tiempo total de la API

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) =>
      perm.name === "Gestionar proyectos" ||
      perm.name === "Gestionar propiedades"
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

    const dbStartTime = performance.now(); // Inicia medición del tiempo de consulta a la BD

    await db.query("CALL delete_multiple_project_media(?)", [
      JSON.stringify(mediaIds),
    ]);

    const dbEndTime = performance.now(); // Finaliza medición de la BD

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const dbDuration = dbEndTime - dbStartTime;

    const response = NextResponse.json({
      message: "Medios eliminados correctamente.",
    });
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, db-query;dur=${dbDuration.toFixed(2)}`
    );

    return response;
  } catch (error) {
    console.error("❌ Error al eliminar los medios:", error);
    return NextResponse.json(
      { error: "Error al eliminar los medios." },
      { status: 500 }
    );
  }
}
