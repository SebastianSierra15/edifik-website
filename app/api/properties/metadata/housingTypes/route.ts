import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { HousingType } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [result] = await db.query("CALL get_housing_types()");
    const rows = (result as RowDataPacket[][])[0];

    const HousingTypes: HousingType[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    return NextResponse.json(HousingTypes);
  } catch (error) {
    console.error("Error en la búsqueda de tipos de vivienda: ", error);
    return NextResponse.json(
      { error: "Error al recuperar los tipos de vivienda" },
      { status: 500 }
    );
  }
}
