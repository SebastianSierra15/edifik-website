import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { City } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [result] = await db.query("CALL get_cities()");
    const rows = (result as RowDataPacket[][])[0];

    const Cities: City[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      departament: {
        id: row.departamentId,
        name: row.departament
      }
    }));
    
    return NextResponse.json(Cities);
  } catch (error) {
    console.error("Error en la búsqueda de ciudades: ", error);
    return NextResponse.json(
      { error: "Error al recuperar las ciudades" },
      { status: 500 }
    );
  }
}
