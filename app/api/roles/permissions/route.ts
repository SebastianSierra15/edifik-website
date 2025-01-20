import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Permission } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_permissions()"
    );

    const [permissionsRows = []] = result;

    const permissions: Permission[] = permissionsRows.map(({ id, name }) => ({
      id,
      name,
    }));
    return NextResponse.json({
      permissions,
    });
  } catch (error) {
    console.error("Error al recuperar los permisos:", error);
    return NextResponse.json(
      { error: "Error al recuperar los permisos" },
      { status: 500 }
    );
  }
}
