import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
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
    const email = searchParams.get("email")?.trim();

    if (!email) {
      return NextResponse.json(
        { error: "Debe proporcionar un correo electrónico." },
        { status: 400 }
      );
    }

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL check_user_email(?)",
      [email]
    );

    if (!result || result.length === 0 || result[0].length === 0) {
      return NextResponse.json({ id: null }, { status: 200 });
    }

    const id = result[0][0];

    const response = NextResponse.json({ id: id });

    return response;
  } catch (error) {
    console.error("Error al verificar correo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
