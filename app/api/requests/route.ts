import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { Request } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";
import { escapeSearchTerm } from "@/utils/escapeSearchTerm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar solicitudes"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const searchTerm = escapeSearchTerm(searchParams.get("searchTerm") || null);

  try {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_requests(?, ?, ?)",
      [page, pageSize, searchTerm]
    );

    const [requestRows = [], [totalEntriesRow] = []] = result;

    const totalEntries = totalEntriesRow?.totalEntries || 0;

    const requests: Request[] = requestRows.map((row: any) => ({
      id: row.id,
      date: row.date,
      operation: row.operation ? "agregar" : "editar",
      responseMessage: row.responseMessage,
      userId: row.userId,
      userEmail: row.userEmail,
      statusRequestName: row.statusRequestName,
      projectId: row.projectId,
      projectName: row.projectName,
    }));

    return NextResponse.json({
      requests,
      totalEntries,
    });
  } catch (error) {
    console.error("Error al recuperar las solicitudes:", error);
    return NextResponse.json(
      { error: "Error al recuperar las solicitudes" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const permissions = session?.user?.permissions;

  const hasPermission = permissions?.some(
    (perm) => perm.name === "Gestionar solicitudes"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const userId = session.user.id;

    const { id, statusId, responseMessage } = await req.json();

    if (!id || !statusId || !responseMessage) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const [result] = await db.query("CALL update_request(?, ?, ?, ?)", [
      id,
      statusId,
      responseMessage,
      userId,
    ]);

    return NextResponse.json(
      { message: "Solicitud actualizada correctamente", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    return NextResponse.json(
      { error: "Error al actualizar la solicitud" },
      { status: 500 }
    );
  }
}
