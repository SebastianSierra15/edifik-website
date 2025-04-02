import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Permission } from "@/lib/definitios";
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
    (perm) => perm.name === "Gestionar roles"
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_permissions()"
    );

    const [permissionsRows = []] = result;

    const permission: Permission[] = permissionsRows.map(({ id, name }) => ({
      id,
      name,
    }));

    const response = NextResponse.json({
      permission,
    });

    return response;
  } catch (error) {
    console.error("Error al recuperar los permisos:", error);
    return NextResponse.json(
      { error: "Error al recuperar los permisos" },
      { status: 500 }
    );
  }
}
