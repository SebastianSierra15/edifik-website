import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { escapeSearchTerm } from "@/utils/escapeSearchTerm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const startTime = performance.now(); // Inicia medición del tiempo total de la API

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar propiedades"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("searchTerm")?.trim();

    if (!searchTerm) {
      return NextResponse.json([], { status: 200 });
    }

    const safeSearchTerm = escapeSearchTerm(
      searchParams.get("searchTerm") || ""
    );

    const dbStartTime = performance.now(); // Inicia medición del tiempo de consulta a la BD

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL search_user_emails(?)",
      [safeSearchTerm]
    );

    const dbEndTime = performance.now(); // Finaliza medición de la BD

    if (!result || result.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const usersRows = result[0] as { id: number; email: string }[];

    const emails = usersRows.map((row) => ({
      id: row.id,
      email: row.email,
    }));

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const dbDuration = dbEndTime - dbStartTime;

    const response = NextResponse.json(emails);
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, db-query;dur=${dbDuration.toFixed(2)}`
    );

    return response;
  } catch (error) {
    console.error("Error al obtener correos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
