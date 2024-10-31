import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PropertyType } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [result] = await db.query("CALL get_property_types()");
    const rows = (result as RowDataPacket[][])[0];

    const propertyTypes: PropertyType[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    return NextResponse.json(propertyTypes);
  } catch (error) {
    console.error("Error en la búsqueda de tipos de propiedad: ", error);
    return NextResponse.json(
      { error: "Error al recuperar los tipos de propiedad" },
      { status: 500 }
    );
  }
}
