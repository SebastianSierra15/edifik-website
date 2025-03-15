import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(request: Request) {
  try {
    const startTime = performance.now();

    const { searchParams } = new URL(request.url);
    const table = searchParams.get("table");
    const name = searchParams.get("name");
    const id = searchParams.get("id");

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    const procedureName = `check_${table}_name`;

    const dbStartTime = performance.now(); // Inicia medición del tiempo de consulta a la BD

    const [result] = await db.query<RowDataPacket[][]>(
      `CALL ${procedureName}(?, ?)`,
      [id || null, name]
    );

    const dbEndTime = performance.now(); // Finaliza medición de la BD

    const total = (result[0] as RowDataPacket[])[0]?.total || 0;

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const dbDuration = dbEndTime - dbStartTime;

    const response = NextResponse.json({ total }, { status: 200 });
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, db-query;dur=${dbDuration.toFixed(2)}`
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Error al verificar el nombre" },
      { status: 500 }
    );
  }
}
