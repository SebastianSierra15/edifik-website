import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { City, Departament } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

function mapResults<T>(
  result: RowDataPacket[] | undefined,
  mapper: (row: any) => T,
): T[] {
  if (!result) return [];
  return result.map(mapper);
}

export async function GET() {
  try {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_cities_departaments()",
    );

    const [departamentsResult, citiesResult] = result;

    const departaments: Departament[] = mapResults(
      departamentsResult,
      (row) => ({
        id: row.departamentId,
        name: row.departamentName,
      }),
    );

    const cities: City[] = mapResults(citiesResult, (row) => ({
      id: row.cityId,
      name: row.cityName,
      departament: {
        id: row.departamentId,
        name: row.departamentName,
      },
    }));

    return NextResponse.json({ departaments, cities });
  } catch (error) {
    console.error("Error en la búsqueda de los datos: ", error);
    return NextResponse.json(
      { error: "Error al recuperar los datos" },
      { status: 500 },
    );
  }
}
