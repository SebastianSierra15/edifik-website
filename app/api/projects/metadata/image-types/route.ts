import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ImageType } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
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
    const dbStartTime = performance.now(); // Inicia medición del tiempo de consulta a la BD

    const [result] = await db.query("CALL get_image_types()");

    const dbEndTime = performance.now(); // Finaliza medición de la BD

    const rows = (result as RowDataPacket[][])[0];

    const ImageTypes: ImageType[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      maxImagesAllowed: row.maxImagesAllowed,
      isRequired: row.isRequired,
    }));

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const dbDuration = dbEndTime - dbStartTime;

    const response = NextResponse.json(ImageTypes);
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, db-query;dur=${dbDuration.toFixed(2)}`
    );

    return response;
  } catch (error) {
    console.error("Error en la búsqueda de tipos de imagenes: ", error);
    return NextResponse.json(
      { error: "Error al recuperar los tipos de imagenes" },
      { status: 500 }
    );
  }
}
