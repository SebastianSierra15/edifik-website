import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { City, Departament } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function mapResults<T>(
  result: RowDataPacket[] | undefined,
  mapper: (row: any) => T
): T[] {
  if (!result) return [];
  return result.map(mapper);
}

export async function GET() {
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
    const dbStartTime = performance.now(); // Inicia medición del tiempo de consulta a la BD

    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_cities_departaments()"
    );

    const dbEndTime = performance.now(); // Finaliza medición de la BD

    const [departamentsResult, citiesResult] = result;

    const departaments: Departament[] = mapResults(
      departamentsResult,
      (row) => ({
        id: row.departamentId,
        name: row.departamentName,
      })
    );

    const cities: City[] = mapResults(citiesResult, (row) => ({
      id: row.cityId,
      name: row.cityName,
      departament: {
        id: row.departamentId,
        name: row.departamentName,
      },
    }));

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const dbDuration = dbEndTime - dbStartTime;

    const response = NextResponse.json({ departaments, cities });
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, db-query;dur=${dbDuration.toFixed(2)}`
    );

    return response;
  } catch (error) {
    console.error("Error en la búsqueda de los datos: ", error);
    return NextResponse.json(
      { error: "Error al recuperar los datos" },
      { status: 500 }
    );
  }
}
