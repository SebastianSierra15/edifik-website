import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Role, MembershipSummary, Gender } from "@/lib/definitios";
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
    (perm) => perm.name === "Gestionar usuarios"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const dbStartTime = performance.now(); // Inicia medición del tiempo de consulta a la BD

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_users_metadata()"
    );

    const dbEndTime = performance.now(); // Finaliza medición de la BD

    const [rolesRows = [], gendersRows = [], membershipsRows = []] = result;

    const roles: Role[] = rolesRows.map(({ id, name }) => ({ id, name }));
    const memberships: MembershipSummary[] = membershipsRows.map(
      ({ id, name }) => ({ id, name })
    );
    const genders: Gender[] = gendersRows.map(({ id, name }) => ({ id, name }));

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const dbDuration = dbEndTime - dbStartTime;

    const response = NextResponse.json({
      roles,
      memberships,
      genders,
    });
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, db-query;dur=${dbDuration.toFixed(2)}`
    );

    return response;
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json(
      { error: "Error al recuperar los datos" },
      { status: 500 }
    );
  }
}
