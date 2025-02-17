import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
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

  try {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_pending_requests()"
    );

    const requestRows = result[0] || [];

    const requests = requestRows.map((row: any) => ({
      id: row.id,
      date: row.date,
      operation: row.operation ? "agregar" : "editar",
      userEmail: row.userEmail,
      statusRequestName: row.statusRequestName,
      projectName: row.projectName,
    }));

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error al recuperar las solicitudes pendientes:", error);
    return NextResponse.json(
      { error: "Error al recuperar las solicitudes pendientes" },
      { status: 500 }
    );
  }
}
