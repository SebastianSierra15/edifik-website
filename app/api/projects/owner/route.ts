import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UserData } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";
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
    (perm) =>
      perm.name === "Gestionar proyectos" ||
      perm.name === "Gestionar propiedades"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Debe proporcionar un nombre de usuario" },
        { status: 400 }
      );
    }

    const dbStartTime = performance.now(); // Inicia medición del tiempo de consulta a la BD

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_user_owner(?)",
      [email]
    );

    const dbEndTime = performance.now(); // Finaliza medición de la BD

    if (!result || result.length === 0 || result[0].length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const userRow = result[0][0];

    const user: UserData = {
      id: userRow.id,
      username: userRow.username,
      names: userRow.names,
      lastnames: userRow.lastnames,
      email: userRow.email,
      phoneNumber: userRow.phoneNumber,
    };

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const dbDuration = dbEndTime - dbStartTime;

    const response = NextResponse.json({ user });
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, db-query;dur=${dbDuration.toFixed(2)}`
    );

    return response;
  } catch (error) {
    console.error("Error al recuperar el usuario:", error);
    return NextResponse.json(
      { error: "Error al recuperar el usuario" },
      { status: 500 }
    );
  }
}
