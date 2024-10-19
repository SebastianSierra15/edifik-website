import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { NearbyService } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [result] = await db.query("CALL get_nearby_services()");
    const rows = (result as RowDataPacket[][])[0];

    const NearbyServices: NearbyService[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    return NextResponse.json(NearbyServices);
  } catch (error) {
    console.error("Error al buscar servicios cercanos: ", error);
    return NextResponse.json(
      { error: "Fallo al buscar servicios cercanos" },
      { status: 500 }
    );
  }
}
