import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(request: Request) {
  try {
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

    const [result] = await db.query<RowDataPacket[][]>(
      `CALL ${procedureName}(?, ?)`,
      [id || null, name]
    );

    const total = (result[0] as RowDataPacket[])[0]?.total || 0;

    const response = NextResponse.json({ total }, { status: 200 });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Error al verificar el nombre" },
      { status: 500 }
    );
  }
}
